'use server'

import { z } from 'zod'
import { unauthenticatedAction } from '~/lib/auth/action-procedures'
import { rateLimitByIp } from '~/lib/auth/limiter'
import { passwordRecoveryUseCase } from '~/lib/use-cases/users'

export const passwordRecoveryAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: 'change-password', limit: 3, window: 30000 })
    await passwordRecoveryUseCase(input.email)
  })
