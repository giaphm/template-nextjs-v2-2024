'use server'

import { unauthenticatedAction } from '~/lib/auth/action-procedures'
import { rateLimitByIp } from '~/lib/auth/limiter'
import { redirect } from 'next/navigation'
import { logInUseCase } from '~/lib/use-cases/users'
import { sendMagicLinkUseCase } from '~/lib/use-cases/magic-links'
import { z } from 'zod'
import { setSession } from '~/lib/auth'
import { PATHS } from '~/app-config'

export const logInMagicLinkAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().min(1, {
        message: 'Username must be at least 1 characters.',
      }),
      password: z.string().min(1, {
        message: 'Username must be at least 1 characters.',
      }),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: input.email, limit: 1, window: 30000 })
    await sendMagicLinkUseCase(input.email)
    return redirect('/login/magic')
  })

export const logInAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().min(1, {
        message: 'Username must be at least 1 characters.',
      }),
      password: z.string().min(1, {
        message: 'Username must be at least 1 characters.',
      }),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: input.email, limit: 1, window: 30000 })
    const user = await logInUseCase(input.email, input.password)
    await setSession(user.id)
    return redirect(PATHS.Dashboard)
  })
