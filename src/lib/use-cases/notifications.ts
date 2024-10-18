import {
  getNotificationById,
  updateNotification,
} from '../data-access/notifications'
import { AuthenticationError, NotFoundError } from './errors'
import { UserSession } from './types'

export async function assertOwnsNotification(
  authenticatedUser: UserSession,
  notificationId: number
) {
  const notification = await getNotificationById(notificationId)

  if (!notification) {
    throw new NotFoundError(`Notification ${notificationId} not found`)
  }

  if (notification.userId !== authenticatedUser.id) {
    throw new AuthenticationError()
  }

  return notification
}

export async function markNotificationAsReadUseCase(
  authenticatedUser: UserSession,
  notificationId: number
) {
  await assertOwnsNotification(authenticatedUser, notificationId)

  const notification = await updateNotification(notificationId, {
    isRead: true,
  })

  return notification
}
