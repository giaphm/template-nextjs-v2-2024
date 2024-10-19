import { TOKEN_LENGTH, TOKEN_TTL } from "~/app-config"
import { generateRandomToken } from "../auth/tokens"
import { db, resetTokens } from "../db"
import { UserId } from "../use-cases/types"

export async function createPasswordRecoveryToken(userId: UserId) {
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
