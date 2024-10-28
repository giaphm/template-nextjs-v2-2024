createPasswordResetToken

import { TOKEN_LENGTH, TOKEN_TTL } from "~/app-config"
import { generateRandomToken } from "~/lib/data-access/utils"
import { db, resetTokens } from "~/lib/db"
import { UserId } from "~/lib/use-cases/types"
import { eq } from "drizzle-orm"

export async function createPasswordResetToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH)
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL)

  await db
    .insert(resetTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: resetTokens.userId,
      set: {
        token,
        tokenExpiresAt,
      },
    })

  return token
}

export async function getPasswordResetToken(token: string) {
  const existingToken = await db.query.resetTokens.findFirst({
    where: eq(resetTokens.token, token),
  })

  return existingToken
}

export async function deletePasswordResetToken(token: string, trx = db) {
  await trx.delete(resetTokens).where(eq(resetTokens.token, token))
}
