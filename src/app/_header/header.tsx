import Link from "next/link"
import Image from "next/image"
import React, { Suspense } from "react"
import { getCurrentUser } from "~/lib/auth"
import { applicationName } from "~/app-config"
import Locale from "~/components/locale"
import HeaderActions from "./header-actions"
import { HeaderActionsFallback } from "./header-actions-fallback"
import HeaderLinks from "./header-links"
import { ThemeToggle } from "~/components/theme-toggle"

export default async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="fixed top-0 z-10 w-full">
      <div className="mx-auto flex w-full max-w-7xl justify-between bg-white px-5 py-4 md:px-6">
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
          <div>
            <ThemeToggle />
          </div>
          <Locale />
          <Suspense fallback={<HeaderActionsFallback />}>
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
