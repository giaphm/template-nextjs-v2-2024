"use server"

import { getPublicGroupInfoByIdUseCase } from "~/lib/use-cases/groups"
import { sendInviteUseCase } from "~/lib/use-cases/invites"
import {
  joinGroupUseCase,
  leaveGroupUseCase,
} from "~/lib/use-cases/memberships"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { authenticatedAction } from "~/lib/auth/action-procedures"

export const joinGroupAction = authenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input: groupId, ctx }) => {
    await joinGroupUseCase(ctx.user, groupId)
    revalidatePath(`/dashboard/groups/${groupId}`, "layout")
  })

export const leaveGroupAction = authenticatedAction
  .createServerAction()
  .input(z.number())
  .handler(async ({ input: groupId, ctx }) => {
    const group = await getPublicGroupInfoByIdUseCase(groupId)
    await leaveGroupUseCase(ctx.user, groupId)
    if (group?.isPublic) {
      revalidatePath(`/dashboard/groups/${groupId}`, "layout")
    } else {
      redirect("/dashboard")
    }
  })

export const sendInviteAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      groupId: z.number(),
    })
  )
  .handler(async ({ input: { email, groupId }, ctx }) => {
    await sendInviteUseCase(ctx.user, { email, groupId })
  })
