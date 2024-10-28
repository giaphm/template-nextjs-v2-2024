import { eq } from "drizzle-orm"
import { accounts, db, User, users } from "../db"
import { UserId } from "../use-cases/types"
import { hashPassword } from "../auth/hashing"
import { getAccountByUserId } from "./accounts"

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  return user
}

export async function createUser(email: string) {
  const [newUser] = await db
    .insert(users)
    .values({
      email,
    })
    .returning()

  return newUser
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await db.update(users).set(updatedUser).where(eq(users.id, userId))
}

export async function verifyPassword(
  email: string,
  plainTextPassword: string
): Promise<boolean> {
  const user = await getUserByEmail(email)
  if (!user) {
    return false
  }

  const account = await getAccountByUserId(user.id)
  if (!account) {
    return false
  }

  const { salt } = account
  const savedHashedPassword = account.password
  if (!salt || !savedHashedPassword) {
    return false
  }

  const hash = await hashPassword(plainTextPassword, salt)

  return savedHashedPassword === hash
}

export async function setEmailVerified(userId: UserId) {
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, userId))
}

export async function createMagicUser(email: string) {
  const [user] = await db
    .insert(users)
    .values({
      email,
      emailVerified: new Date(),
    })
    .returning()

  await db
    .insert(accounts)
    .values({ userId: user.id, accountType: "email" })
    .returning()

  return user
}

export async function deleteUser(userId: UserId) {
  await db.delete(users).where(eq(users.id, userId))
}
