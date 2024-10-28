import { applicationName } from "~/app-config"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "~/components/theme-toggle"

export function ComingSoonHeader() {
  return (
    <div className="container relative z-20 mx-auto py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-blue-100"
          >
            <Image
              src="/group.jpeg"
              width="60"
              height="60"
              alt="hero image"
              className="mr-4 h-16 w-16 rounded-full"
            />
            <div className="flex flex-col">
              <div className="text-xs sm:text-xl">Coming Soon...</div>
              <div className="text-lg sm:text-3xl">{applicationName}</div>
            </div>
          </Link>
        </div>

        <ThemeToggle />
      </div>
    </div>
  )
}
