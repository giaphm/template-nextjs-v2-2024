'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import React, { useState } from 'react'
import { useServerAction } from 'zsa-react'
import { Notification } from '~/lib/db/schema'
import { BellIcon } from 'lucide-react'
import Link from 'next/link'
import { getNotificationIcon, getNotificationLink } from '~/utils/notifications'
import { markNotificationAsReadAction } from './actions'

export default function Notifications({
  notifications,
}: {
  notifications: Notification[]
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { execute } = useServerAction(markNotificationAsReadAction, {
    onSuccess(data) {
      console.log('data', data)
      setIsOpen(false)
    },
  })

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <div className="relative p-2">
          <BellIcon className="h-6 w-6" />
          {notifications.length > 0 && (
            <div className="absolute right-[1px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 text-xs text-white" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 && (
          <div className="flex items-center gap-2 p-4">
            <div>No new notifications</div>
          </div>
        )}

        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} asChild>
            <Link
              onClick={async () => {
                await execute({ notificationId: notification.id })
              }}
              className="cursor-pointer"
              href={getNotificationLink(notification)}
            >
              <div className="flex items-center gap-2 p-4">
                {getNotificationIcon(notification)}
                <div>{notification.message}</div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}

        <div className="flex justify-center py-4">
          <Link
            onClick={() => {
              setIsOpen(false)
            }}
            className="text-xs text-blue-400 hover:text-blue-500"
            href="/notifications"
          >
            View Notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
