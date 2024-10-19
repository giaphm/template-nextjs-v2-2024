import { eq } from "drizzle-orm"
import { generateRandomToken } from "../auth/tokens"
import { db, magicLinks } from "../db"
import { TOKEN_LENGTH, TOKEN_TTL } from "~/app-config"

export async function upsertMagicLink(email: string) {
  const token = await generateRandomToken(TOKEN_LENGTH)
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL)

  await db
    .insert(magicLinks)
    .values({
      email,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: magicLinks.email,
      set: {
        token,
        tokenExpiresAt,
      },
    })

  return token
}

export async function getMagicLinkByToken(token: string) {
  return db.query.magicLinks.findFirst({ where: eq(magicLinks.token, token) })
}

export async function deleteMagicToken(token: string) {
  return db.delete(magicLinks).where(eq(magicLinks.token, token))
}
