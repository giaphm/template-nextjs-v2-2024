"use server"

import { authenticatedAction } from "~/lib/auth/action-procedures"
import {
  kickMemberUseCase,
  switchMemberRoleUseCase,
} from "~/lib/use-cases/memberships"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const kickMemberAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      groupId: z.number(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await kickMemberUseCase(ctx.user, {
      userId: input.userId,
      groupId: input.groupId,
    })
    revalidatePath(`/dashboard/groups/${input.groupId}/members`)
  })

export const switchMemberRoleAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      groupId: z.number(),
      role: z.literal("admin").or(z.literal("member")),
    })
  )
  .handler(async ({ input, ctx }) => {
    await switchMemberRoleUseCase(ctx.user, {
      userId: input.userId,
      groupId: input.groupId,
      role: input.role,
    })
    revalidatePath(`/dashboard/groups/${input.groupId}/members`)
  })
