import React, { Suspense } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { getCurrentUser } from '~/lib/auth'
import { ProfileAvatar } from '~/components/profile-avatar'
import Link from 'next/link'
import { Settings2Icon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import NotificationsWrapper from './notification-wrapper'
import SignOutItem from './sign-out-item'
import MenuButton from './menu-button'

export default async function HeaderActions() {
  const user = await getCurrentUser()
  const isSignedIn = !!user

  return (
    <div>
      {isSignedIn ? (
        <div className="flex gap-x-2">
          <Suspense>
            <NotificationsWrapper />
          </Suspense>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Suspense
                fallback={
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-800">
                    ..
                  </div>
                }
              >
                <ProfileAvatar userId={user.id} />
              </Suspense>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Settings2Icon className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <SignOutItem />
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <MenuButton />
          </div>
        </div>
      ) : (
        <Button asChild variant="secondary">
          <Link href="/login">Log In</Link>
        </Button>
      )}
    </div>
  )
}
