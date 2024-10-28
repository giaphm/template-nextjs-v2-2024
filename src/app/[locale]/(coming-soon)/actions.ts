"use server"

import { z } from "zod"
import { unauthenticatedAction } from "~/lib/auth/action-procedures"
import { rateLimitByIp } from "~/lib/auth/limiter"
import { subscribeEmailUseCase } from "~/lib/use-cases/newsletter"

export const subscribeEmailAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input: { email } }) => {
    await rateLimitByIp({ key: "newsletter" })
    await subscribeEmailUseCase(email)
  })
