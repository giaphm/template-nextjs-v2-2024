'use client'

import { LogOut } from 'lucide-react'
import React from 'react'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import NProgress from 'nprogress'
import { signOutAction } from './actions'

export default function SignOutItem() {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onSelect={async () => {
        NProgress.start()
        signOutAction().then(() => {
          NProgress.done()
        })
      }}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </DropdownMenuItem>
  )
}
