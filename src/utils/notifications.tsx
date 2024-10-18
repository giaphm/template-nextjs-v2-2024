import { Notification } from '~/lib/db'
import { Calendar, MessageCircle } from 'lucide-react'

export function getNotificationLink(notification: Notification) {
  const urls: { [key: string]: string } = {
    event: `/dashboard/groups/${notification.groupId}/events`,
    reply: `/dashboard/groups/${notification.groupId}/posts/${notification.postId}#replies`,
  }

  return urls[notification.type]
}

export async function getNotificationIcon(notification: Notification) {
  if (notification.type === 'event') {
    return <Calendar className="h-5 w-5" />
  }
  if (notification.type === 'reply') {
    return <MessageCircle className="h-5 w-5" />
  }

  return null
}
