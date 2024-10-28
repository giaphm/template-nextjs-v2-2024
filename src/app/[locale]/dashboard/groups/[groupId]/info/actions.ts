"use server"

import { updateGroupInfoUseCase } from "~/lib/use-cases/groups"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import sanitizeHtml from "sanitize-html"
import { authenticatedAction } from "~/lib/auth/action-procedures"

export const updateGroupInfoAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      groupId: z.number(),
      info: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await updateGroupInfoUseCase(ctx.user, {
      groupId: input.groupId,
      info: sanitizeHtml(input.info),
    })

    revalidatePath(`/dashboard/groups/${input.groupId}/info`)
  })
