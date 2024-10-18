'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
  deleteSessionTokenCookie,
  invalidateSession,
  validateRequest,
} from '~/lib/auth'
import { authenticatedAction } from '~/lib/auth/action-procedures'
import { markNotificationAsReadUseCase } from '~/lib/use-cases/notifications'

export const markNotificationAsReadAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      notificationId: z.number(),
    })
  )
  .handler(async ({ input: { notificationId }, ctx: { user } }) => {
    await markNotificationAsReadUseCase(user, notificationId)
    revalidatePath('/', 'layout')
  })

export async function signOutAction() {
  const { session } = await validateRequest()

  if (!session) {
    redirect('/login')
  }

  await invalidateSession(session.id)
  deleteSessionTokenCookie()
  redirect('/sign-in')
}
