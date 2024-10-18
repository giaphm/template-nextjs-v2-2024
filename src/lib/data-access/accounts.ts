import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { eq, and } from 'drizzle-orm'
import { accounts, db, NewAccount } from '../db'
import { hashPassword } from '../auth/hashing'
import { UserId } from '../use-cases/types'

export async function createAccount(
  userId: number,
  password: string
): Promise<NewAccount | undefined> {
  const salt = crypto.randomBytes(128).toString('base64')
  const hashedPassword = await hashPassword(password, salt)
  const [newAccount] = await db
    .insert(accounts)
    .values({
      userId,
      accountType: 'email',
      githubId: uuidv4(),
      googleId: uuidv4(),
      password: hashedPassword,
      salt,
    })
    .returning()

  return newAccount
}

export async function getAccountByUserId(userId: UserId) {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.id, userId),
  })

  return account
}

export async function updatePassword(
  userId: UserId,
  password: string,
  trx = db
) {
  const salt = crypto.randomBytes(128).toString('base64')
  const hash = await hashPassword(password, salt)

  await trx
    .update(accounts)
    .set({
      password: hash,
      salt,
    })
    .where(and(eq(accounts.userId, userId), eq(accounts.accountType, 'email')))
}
