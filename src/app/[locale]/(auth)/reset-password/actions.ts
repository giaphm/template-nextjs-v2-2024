'use server'

import { z } from 'zod'
import { unauthenticatedAction } from '~/lib/auth/action-procedures'
import { rateLimitByIp } from '~/lib/auth/limiter'
import { changePasswordUseCase } from '~/lib/use-cases/users'

export const changePasswordAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      token: z.string(),
      password: z.string().min(1),
    })
  )
  .handler(async ({ input: { token, password } }) => {
    await rateLimitByIp({ key: 'reset-password', limit: 2, window: 30000 })
    await changePasswordUseCase(token, password)
  })
