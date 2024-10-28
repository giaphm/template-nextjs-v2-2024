"use server"

import { authenticatedAction } from "~/lib/auth/action-procedures"
import {
  deleteSessionTokenCookie,
  invalidateUserSessions,
} from "~/lib/auth/auth"
import { redirect } from "next/navigation"

export const invalidateUserSessionsAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    await invalidateUserSessions(ctx.user.id)
    deleteSessionTokenCookie()
    redirect("/sign-in")
  })
