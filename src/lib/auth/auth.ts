import "server-only"
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding"
import { sha256 } from "@oslojs/crypto/sha2"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { cache } from "react"
import env from "~/env"
import { db, Session, sessions, User, users } from "../db"
import { UserId } from "../use-cases/types"
import { AuthenticationError } from "../use-cases/errors"
import { GitHub, Google } from "arctic"

const SESSION_COOKIE_NAME = "session"

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  `${env.HOST_NAME}/api/login/github/callback`
)

export const googleAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.HOST_NAME}/api/login/google/callback`
)

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

export async function createSession(
  token: string,
  userId: UserId
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  }
  await db.insert(sessions).values(session)
  return session
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const sessionInDb = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
  })
  if (!sessionInDb) {
    return { session: null, user: null }
  }
  if (Date.now() >= sessionInDb.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, sessionInDb.id))
    return { session: null, user: null }
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, sessionInDb.userId),
  })

  if (!user) {
    await db.delete(sessions).where(eq(sessions.id, sessionInDb.id))
    return { session: null, user: null }
  }

  if (
    Date.now() >=
    sessionInDb.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS
  ) {
    sessionInDb.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS)
    await db
      .update(sessions)
      .set({
        expiresAt: sessionInDb.expiresAt,
      })
      .where(eq(sessions.id, sessionInDb.id))
  }
  return { session: sessionInDb, user }
}

export function getSessionToken(): string | undefined {
  return cookies().get(SESSION_COOKIE_NAME)?.value
}

export const validateRequest = async (): Promise<SessionValidationResult> => {
  const sessionToken = getSessionToken()
  if (!sessionToken) {
    return { session: null, user: null }
  }
  return validateSessionToken(sessionToken)
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId))
}

export async function invalidateUserSessions(userId: UserId): Promise<void> {
  await db.delete(sessions).where(eq(users.id, userId))
}

export function setSessionTokenCookie(token: string, expiresAt: Date): void {
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })
}

export function deleteSessionTokenCookie(): void {
  cookies().set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
}

export const getCurrentUser = cache(async () => {
  const session = await validateRequest()

  if (!session.user) {
    return undefined
  }

  return session.user
})

export const assertAuthenticated: () => Promise<User> | never = async () => {
  const user = await getCurrentUser()

  if (!user) {
    throw new AuthenticationError()
  }

  return user
}

export async function setSession(userId: UserId) {
  const token = generateSessionToken()
  const session = await createSession(token, userId)
  setSessionTokenCookie(token, session.expiresAt)
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null }
