"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { Button } from "~/components/ui/button"
import useMediaDeviceDetect from "~/hooks/use-media-device-detect"
import Link from "next/link"
import { BookIcon, SearchIcon, UsersIcon } from "lucide-react"

export default function HeaderLinks({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  const path = usePathname()
  const { isMobile } = useMediaDeviceDetect()
  const isLandingPage = path === "/"

  if (isMobile) {
    return null
  }

  return (
    <>
      {!isLandingPage && isAuthenticated && (
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="link"
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href="/dashboard">
              <UsersIcon className="h-4 w-4" /> Your Groups
            </Link>
          </Button>

          <Button
            variant="link"
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href="/browse">
              <SearchIcon className="h-4 w-4" /> Browse Groups
            </Link>
          </Button>

          <Button
            variant="link"
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href="/docs">
              <BookIcon className="h-4 w-4" /> API Docs
            </Link>
          </Button>
        </div>
      )}

      {(isLandingPage || !isAuthenticated) && (
        <div className="hidden gap-4 md:flex">
          <Button variant="link" asChild className="dark:text-black">
            <Link href="/#features">Features</Link>
          </Button>

          <Button variant="link" asChild className="dark:text-black">
            <Link href="/#pricing">Pricing</Link>
          </Button>

          <Button variant="link" asChild className="dark:text-black">
            <Link href="/browse">Browse Groups</Link>
          </Button>
        </div>
      )}
    </>
  )
}
