"use server"

import {
  clearReadNotificationsUseCase,
  markAllNotificationsAsReadUseCase,
  markNotificationAsReadUseCase,
} from "~/lib/use-cases/notifications"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { authenticatedAction } from "~/lib/auth/action-procedures"
import { getNotificationLink } from "~/utils/notifications"

export const markAllNotificationsAsReadAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    await markAllNotificationsAsReadUseCase(ctx.user)
    revalidatePath("/notifications")
    revalidatePath("/", "layout")
  })

export const clearReadNotificationsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    await clearReadNotificationsUseCase(ctx.user)
    revalidatePath("/notifications")
  })

export const readNotificationAction = authenticatedAction
  .createServerAction()
  .input(z.object({ notificationId: z.number() }))
  .handler(async ({ ctx, input }) => {
    const notification = await markNotificationAsReadUseCase(
      ctx.user,
      input.notificationId
    )
    redirect(getNotificationLink(notification))
  })
