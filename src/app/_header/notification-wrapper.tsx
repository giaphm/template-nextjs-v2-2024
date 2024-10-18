import React from 'react'
import { getCurrentUser } from '~/lib/auth'
import { getUnreadNotificationForUserUseCase } from '~/lib/use-cases/users'
import Notifications from './notifications'

export default async function NotificationsWrapper() {
  const user = await getCurrentUser()
  if (!user) {
    return null
  }

  const notifications = await getUnreadNotificationForUserUseCase(user.id)

  return <Notifications notifications={notifications} />
}
