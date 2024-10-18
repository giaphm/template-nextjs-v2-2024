import Link from 'next/link'
import Image from 'next/image'
import React, { Suspense } from 'react'
import { getCurrentUser } from '~/lib/auth'
import { applicationName } from '~/app-config'
import Locale from '~/components/locale'
import HeaderActions from './header-actions'
import { HeaderActionsFallback } from './header-actions-fallback'
import HeaderLinks from './header-links'

export default async function Header() {
  const user = await getCurrentUser()

  return (
    <div className="px-5 md:px-6">
      <div className="mx-auto flex w-full max-w-7xl justify-between py-4">
        <div className="flex items-center justify-between gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/group.jpeg"
              alt="Group Finder Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-sm font-bold md:text-base lg:text-2xl">
              {applicationName}
            </span>
          </Link>

          <HeaderLinks isAuthenticated={!!user} />
        </div>

        <div className="flex items-center justify-between gap-5">
          <Suspense fallback={<HeaderActionsFallback />}>
            <Locale />
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
