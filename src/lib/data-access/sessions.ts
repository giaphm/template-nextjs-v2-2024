import { eq } from 'drizzle-orm'
import { db, sessions } from '../db'
import { UserId } from '../use-cases/types'

export async function deleteSessionForUser(userId: UserId, trx = db) {
  return trx.delete(sessions).where(eq(sessions.userId, userId))
}
