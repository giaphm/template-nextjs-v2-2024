import { and, eq } from 'drizzle-orm'
import { db, Notification, notifications } from '../db'
import { UserId } from '../use-cases/types'

const MAX_NOTIFICATIONS_IN_HEADER = 3

export async function getNotificationById(notificationId: number) {
  return db.query.notifications.findFirst({
    where: eq(notifications.id, notificationId),
  })
}

export async function updateNotification(
  notificationId: number,
  updatedNotification: Partial<Notification>
) {
  const [notification] = await db
    .update(notifications)
    .set(updatedNotification)
    .where(eq(notifications.id, notificationId))
    .returning()

  return notification
}

export async function getTop3UnreadNotificationsForUser(userId: UserId) {
  return db.query.notifications.findMany({
    where: and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ),
    limit: MAX_NOTIFICATIONS_IN_HEADER,
  })
}
