"use server"

import { authenticatedAction } from "~/lib/auth/action-procedures"
import { createGroupFormSchema } from "./_components/validation"
import { rateLimitByKey } from "~/lib/auth/limiter"
import { createGroupUseCase } from "~/lib/use-cases/groups"
import { revalidatePath } from "next/cache"

export const createGroupAction = authenticatedAction
  .createServerAction()
  .input(createGroupFormSchema)
  .handler(async ({ input: { name, description }, ctx: { user } }) => {
    await rateLimitByKey({ key: `${user.id}-create-group` })
    await createGroupUseCase(user, {
      name,
      description,
    })
    revalidatePath("/dashboard")
  })
