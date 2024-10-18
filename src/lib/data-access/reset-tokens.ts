import { eq } from 'drizzle-orm'
import { db, resetTokens } from '../db'

export async function getPasswordResetToken(token: string) {
  return db.query.resetTokens.findFirst({ where: eq(resetTokens.token, token) })
}

export async function deletePasswordResetToken(token: string, trx = db) {
  await trx.delete(resetTokens).where(eq(resetTokens.token, token))
}
