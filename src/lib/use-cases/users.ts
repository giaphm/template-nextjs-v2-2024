import { VercelPgClient, VercelPgDatabase } from "drizzle-orm/vercel-postgres"
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"
import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
  applicationName,
} from "~/app-config"
import { GitHubUser } from "~/app/api/login/github/callback/route"
import { GoogleUser } from "~/app/api/login/google/callback/route"
import PasswordRecoveryEmail from "~/components/password-recovery-email"
import { VerifyEmail } from "~/components/verify-email"
import env from "~/env"
import {
  createAccount,
  createAccountViaGithub,
  createAccountViaGoogle,
  updatePassword,
} from "~/lib/data-access/accounts"
import {
  getNotificationsForUser,
  getTop3UnreadNotificationsForUser,
} from "~/lib/data-access/notifications"
import {
  createProfile,
  getProfile,
  updateProfile,
} from "~/lib/data-access/profiles"
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken,
} from "~/lib/data-access/reset-tokens"
import { deleteSessionForUser } from "~/lib/data-access/sessions"
import {
  createUser,
  deleteUser,
  getUserByEmail,
  updateUser,
  verifyPassword,
} from "~/lib/data-access/users"
import { createTransaction } from "~/lib/data-access/utils"
import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken,
} from "~/lib/data-access/verify-email"
import { UserId, UserSession } from "~/lib/use-cases/types"
import { getFileUrl, uploadFileToBucket } from "~/utils/files"
import { createUUID } from "~/utils/uuid"
import { sendEmail } from "../email/sendEmail"
import { LoginError, PublicError } from "./errors"

export async function deleteUserUseCase(
  authenticatedUser: UserSession,
  userToDeleteId: UserId
): Promise<void> {
  if (authenticatedUser.id !== userToDeleteId) {
    throw new PublicError("You can only delete your own account")
  }

  await deleteUser(userToDeleteId)
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId)

  if (!profile) {
    throw new PublicError("User not found")
  }

  return profile
}

export async function registerUserUseCase(email: string, password: string) {
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new PublicError("An user with that email already exists.")
  }
  const user = await createUser(email)
  await createAccount(user.id, password)

  const displayName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  })
  await createProfile(user.id, displayName)

  try {
    const token = await createVerifyEmailToken(user.id)
    await sendEmail(
      email,
      `Verify your email for ${applicationName}`,
      VerifyEmail({ token })
    )
  } catch (error) {
    console.error(
      "Verification email would not be sent, did you setup the resend API key?",
      error
    )
  }

  return { id: user.id }
}

export async function registerUserReturnTokenUseCase(
  email: string,
  password: string
) {
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new PublicError("An user with that email already exists.")
  }
  const user = await createUser(email)
  await createAccount(user.id, password)

  const displayName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  })
  await createProfile(user.id, displayName)

  let token

  try {
    token = await createVerifyEmailToken(user.id)
    await sendEmail(
      email,
      `Verify your email for ${applicationName}`,
      VerifyEmail({ token })
    )
  } catch (error) {
    console.error(
      "Verification email would not be sent, did you setup the resend API key?",
      error
    )
  }

  return { id: user.id, token }
}

export async function logInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    throw new LoginError()
  }

  const isPasswordCorrect = await verifyPassword(email, password)

  if (!isPasswordCorrect) {
    throw new LoginError()
  }

  return { id: user.id }
}

export function getProfileImageKey(userId: UserId, imageId: string) {
  return `users/${userId}/images/${imageId}`
}

export async function updateProfileImageUseCase(file: File, userId: UserId) {
  if (!file.type.startsWith("image/")) {
    throw new PublicError("File should be an image.")
  }

  if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new PublicError(
      `File size should be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB.`
    )
  }

  const imageId = createUUID()

  await uploadFileToBucket(file, getProfileImageKey(userId, imageId))
  await updateProfile(userId, { imageId })
}

export function getProfileImageUrl(userId: UserId, imageId: string) {
  return `${env.HOST_NAME}/api/users/${userId}/images/${imageId ?? "default"}`
}

export function getDefaultImage(userId: UserId) {
  return `${env.HOST_NAME}/api/users/${userId}/images/default`
}

export async function getProfileImageUrlUseCase({
  userId,
  imageId,
}: {
  userId: UserId
  imageId: string
}) {
  const url = await getFileUrl({
    key: getProfileImageKey(userId, imageId),
  })

  return url
}

export async function updateProfileBioUseCase(userId: UserId, bio: string) {
  await updateProfile(userId, { bio })
}

export async function updateProfileNameUseCase(
  userId: UserId,
  displayName: string
) {
  await updateProfile(userId, { displayName })
}

export async function createGithubUserUseCase(githubUser: GitHubUser) {
  let existingUser = await getUserByEmail(githubUser.email)

  if (!existingUser) {
    existingUser = await createUser(githubUser.email)
  }

  await createAccountViaGithub(existingUser.id, githubUser.id)

  await createProfile(existingUser.id, githubUser.login, githubUser.avatar_url)

  return existingUser.id
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email)

  if (!existingUser) {
    existingUser = await createUser(googleUser.email)
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub)

  await createProfile(existingUser.id, googleUser.name, googleUser.picture)

  return existingUser.id
}

export async function passwordRecoveryUseCase(email: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const token = await createPasswordResetToken(user.id)

  await sendEmail(
    email,
    `Your password reset link for ${applicationName}`,
    PasswordRecoveryEmail({ token })
  )
}

export async function changePasswordUseCase(token: string, password: string) {
  const tokenEntry = await getPasswordResetToken(token)

  if (!tokenEntry) {
    throw new PublicError("Invalid token")
  }

  const userId = tokenEntry.userId

  await createTransaction(
    async (
      trx:
        | (VercelPgDatabase<typeof import("../db/schema")> & {
            $client: VercelPgClient
          })
        | undefined
    ) => {
      await deletePasswordResetToken(token, trx)
      await updatePassword(userId, password, trx)
      await deleteSessionForUser(userId, trx)
    }
  )
}

export async function verifyEmailUseCase(token: string) {
  const tokenEntry = await getVerifyEmailToken(token)

  if (!tokenEntry) {
    throw new PublicError("Invalid token")
  }

  const userId = tokenEntry.userId

  await updateUser(userId, { emailVerified: new Date() })
  await deleteVerifyEmailToken(token)
  return userId
}

export async function getUnreadNotificationsForUserUseCase(userId: UserId) {
  return await getTop3UnreadNotificationsForUser(userId)
}

export async function getNotificationsForUserUseCase(userId: UserId) {
  const notifications = await getNotificationsForUser(userId)
  notifications.sort((a, b) => b.createdOn.getTime() - a.createdOn.getTime())
  return notifications
}
