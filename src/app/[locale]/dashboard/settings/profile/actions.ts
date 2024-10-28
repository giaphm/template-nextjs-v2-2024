"use server"

import {
  updateProfileBioUseCase,
  updateProfileNameUseCase,
} from "~/lib/use-cases/users"
import { z } from "zod"
import { updateProfileImageUseCase } from "~/lib/use-cases/users"
import { revalidatePath } from "next/cache"
import sanitizeHtml from "sanitize-html"
import { authenticatedAction } from "~/lib/auth/action-procedures"
import { rateLimitByKey } from "~/lib/auth/limiter"

export const updateProfileImageAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      fileWrapper: z.instanceof(FormData),
    })
  )
  .handler(async ({ input, ctx }) => {
    await rateLimitByKey({
      key: `update-profile-image-${ctx.user.id}`,
      limit: 3,
      window: 60000,
    })
    const file = input.fileWrapper.get("file") as File
    await updateProfileImageUseCase(file, ctx.user.id)
    revalidatePath(`/dashboard/settings/profile`)
  })

export const updateProfileNameAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      profileName: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await updateProfileNameUseCase(ctx.user.id, input.profileName)
    revalidatePath(`/dashboard/settings/profile`)
  })

export const updateProfileBioAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      bio: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await updateProfileBioUseCase(ctx.user.id, sanitizeHtml(input.bio))
    revalidatePath(`/dashboard/settings/profile`)
  })
