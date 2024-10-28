"use server"

import { deleteUserUseCase } from "~/lib/use-cases/users"
import { redirect } from "next/navigation"
import { z } from "zod"
import { authenticatedAction } from "~/lib/auth/action-procedures"

export const deleteAccountAction = authenticatedAction
  .createServerAction()
  .input(z.void())
  .handler(async ({ ctx: { user } }) => {
    await deleteUserUseCase(user, user.id)
    redirect("/")
  })
