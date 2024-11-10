"use server"

import { z } from "zod"
import { unauthenticatedAction } from "~/lib/auth/action-procedures"
import { rateLimitByIp } from "~/lib/auth/limiter"
import { registerUserReturnTokenUseCase } from "~/lib/use-cases/users"

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(
    z
      .object({
        email: z.string().email("Please enter a valid email"),
        displayName: z
          .string()
          .min(1, "Please provide your display name.")
          .max(255),
        password: z.string().min(1, "Please provide your password.").max(255),
        passwordConfirm: z.string().min(1, {
          message: "Please provide your password confirm.",
        }),
      })
      .refine((val) => val.password === val.passwordConfirm, {
        message: "Passwords don't match",
        path: ["passwordConfirm"],
      })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: "register", limit: 3, window: 30000 })

    const { email, password } = input
    return await registerUserReturnTokenUseCase(email, password)
  })
