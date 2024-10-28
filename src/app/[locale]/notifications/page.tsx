import { getCurrentUser } from "~/lib/auth/auth"
import { cn, formatDate } from "~/lib/utils"
import { cardStyles, pageTitleStyles } from "~/styles/common"
import Image from "next/image"
import { getNotificationsForUserUseCase } from "~/lib/use-cases/users"
import { PageHeader } from "~/components/page-header"
import { MarkReadAllButton } from "./mark-read-button"
import { ViewButton } from "./view-button"
import { ClearReadButton } from "./clear-read-button"
import { getNotificationIcon } from "~/utils/notifications"

export default async function NotificationsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const notifications = await getNotificationsForUserUseCase(user.id)

  return (
    <>
      <PageHeader>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
          <h1
            className={cn(pageTitleStyles, "flex items-center justify-between")}
          >
            Your Notifications
          </h1>

          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <MarkReadAllButton />
            <ClearReadButton />
          </div>
        </div>
      </PageHeader>

      <div className="container mx-auto min-h-screen max-w-2xl py-12">
        <div className="space-y-8">
          {notifications.length === 0 && (
            <div
              className={cn(
                cardStyles,
                "flex flex-col items-center justify-center gap-8 py-12"
              )}
            >
              <Image
                src="/empty-state/no-data.svg"
                width="200"
                height="200"
                alt="no image placeholder image"
              ></Image>
              <h2 className="text-2xl">You have no notifications</h2>
            </div>
          )}

          <div className="space-y-8">
            {notifications.map((notification) => {
              return (
                <div
                  key={notification.id}
                  className="w-full space-y-4 rounded-xl border p-4 sm:p-6 md:p-8"
                >
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification)}
                    </div>
                    <div className="flex-grow space-y-2">
                      <h3 className="text-lg sm:text-xl">
                        {notification.message}
                      </h3>
                      <p className="text-sm text-gray-900 dark:text-gray-200 sm:text-base">
                        {formatDate(notification.createdOn)}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <ViewButton notification={notification} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
