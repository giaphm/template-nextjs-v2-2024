import { applicationName } from '~/app-config'
import MagicLinkEmail from '~/components/magic-link-email'
import { sendEmail } from '../email/sendEmail'
import {
  getMagicLinkByToken,
  upsertMagicLink,
  deleteMagicToken,
} from '../data-access/magic-links'
import {
  ExpiredMagicLinkTokenError,
  InvalidMagicLinkTokenError,
} from './errors'
import {
  createMagicUser,
  getUserByEmail,
  setEmailVerified,
} from '../data-access/users'
import { faker } from '@faker-js/faker'
import { createProfile } from '../data-access/profiles'

export async function sendMagicLinkUseCase(email: string) {
  const token = await upsertMagicLink(email)

  await sendEmail(
    email,
    `Your magic log-in link for ${applicationName}`,
    MagicLinkEmail({ token })
  )
}

export async function loginWithMagicLinkUseCase(token: string) {
  const magicLinkInfo = await getMagicLinkByToken(token)

  if (!magicLinkInfo) {
    throw new InvalidMagicLinkTokenError()
  }

  if (magicLinkInfo.tokenExpiresAt < new Date()) {
    throw new ExpiredMagicLinkTokenError()
  }

  const existingUser = await getUserByEmail(magicLinkInfo.email)

  if (!existingUser) {
    const newUser = await createMagicUser(magicLinkInfo.email)
    const displayName = faker.person.fullName()
    await createProfile(newUser.id, displayName)
    await deleteMagicToken(token)

    return newUser
  }

  await setEmailVerified(existingUser.id)
  await deleteMagicToken(token)

  return existingUser
}
