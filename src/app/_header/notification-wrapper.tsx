import React from "react"
import { getCurrentUser } from "~/lib/auth"
import { getUnreadNotificationsForUserUseCase } from "~/lib/use-cases/users"
import Notifications from "./notifications"

export default async function NotificationsWrapper() {
  const user = await getCurrentUser()
  if (!user) {
    return null
  }

  const notifications = await getUnreadNotificationsForUserUseCase(user.id)

  return <Notifications notifications={notifications} />
}
