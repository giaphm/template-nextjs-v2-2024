import { applicationName } from '~/app-config'
import { VerifyEmail } from '~/components/verify-email'
import PasswordRecoveryEmail from '~/components/password-recovery-email'
import env from '~/env'
import { createAccount, updatePassword } from '../data-access/accounts'
import { createProfile, getProfile } from '../data-access/profiles'
import {
  createUser,
  getUserByEmail,
  updateUser,
  verifyPassword,
} from '../data-access/users'
import {
  CreateUserError,
  EmailInUseError,
  ExpiredEmailVerificationError,
  InvalidTokenError,
  LogInError,
  UserProfileNotFoundError,
} from './errors'
import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from '../data-access/verify-email-tokens'
import { sendEmail } from '../email/sendEmail'
import { createPasswordRecoveryToken } from '../data-access/password-recovery'
import { UserId } from './types'
import { getTop3UnreadNotificationsForUser } from '../data-access/notifications'
import {
  deletePasswordResetToken,
  getPasswordResetToken,
} from '../data-access/reset-tokens'
import { createTransaction } from '../data-access/utils'
import { deleteSessionForUser } from '../data-access/sessions'

export async function registerUserUseCase(
  email: string,
  password: string,
  displayName: string
) {
  const isUserExisted = await getUserByEmail(email)
  if (isUserExisted) {
    throw new EmailInUseError()
  }

  const user = await createUser(email)
  if (!user) {
    throw new CreateUserError()
  }
  await createAccount(user.id, password)
  await createProfile(user.id, displayName)

  const token = await createVerifyEmailToken(user.id)
  await sendEmail(
    email,
    `Verify your email for ${applicationName}`,
    VerifyEmail({ token })
  )
}

export async function verifyEmailUseCase(token: string) {
  const tokenEntry = await getVerifyEmailToken(token)

  if (!tokenEntry) {
    throw new InvalidTokenError()
  }

  if (tokenEntry.tokenExpiresAt.getTime() < Date.now()) {
    throw new ExpiredEmailVerificationError()
  }

  const { userId } = tokenEntry

  await updateUser(userId, { emailVerified: new Date() })
  await deleteVerifyEmailToken(token)
  return userId
}

export async function logInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user) {
    throw new LogInError()
  }

  const isPasswordCorrect = await verifyPassword(email, password)
  if (!isPasswordCorrect) {
    throw new LogInError()
  }

  return { id: user.id }
}

export async function passwordRecoveryUseCase(email: string): Promise<void> {
  const user = await getUserByEmail(email)
  if (!user) {
    return
  }

  const token = await createPasswordRecoveryToken(user.id)

  await sendEmail(
    email,
    `Your password reset link for ${applicationName}`,
    PasswordRecoveryEmail({ token })
  )
}

export async function getUnreadNotificationForUserUseCase(userId: UserId) {
  return getTop3UnreadNotificationsForUser(userId)
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId)

  if (!profile) {
    throw new UserProfileNotFoundError()
  }

  return profile
}

export function getProfileImageUrl(userId: UserId, imageId: string) {
  return `${env.HOST_NAME}/api/users/${userId}/images/${imageId ?? 'default'}`
}

export async function changePasswordUseCase(token: string, password: string) {
  const tokenEntry = await getPasswordResetToken(token)

  if (!tokenEntry) {
    throw new InvalidTokenError()
  }

  const { userId } = tokenEntry

  await createTransaction(async (trx) => {
    await deletePasswordResetToken(token, trx)
    await updatePassword(userId, password, trx)
    await deleteSessionForUser(userId, trx)
  })
}
