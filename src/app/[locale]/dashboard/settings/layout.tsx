import { SettingsTab } from "~/app/[locale]/dashboard/settings/tabs-section"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { SquareUser } from "lucide-react"
import { btnIconStyles, btnStyles } from "~/styles/icons"
import { getUserPlanUseCase } from "~/lib/use-cases/subscriptions"
import { Suspense } from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { headerStyles } from "~/styles/common"
import { cn } from "~/lib/utils"
import { getCurrentUser } from "~/lib/auth"

export default async function SettingsPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className={cn(headerStyles, "py-8")}>
        <div className="container mx-auto">
          <div className="flex justify-between">
            <h1 className="text-4xl">Account Settings</h1>

            <Suspense
              fallback={<Skeleton className="h-[40px] w-[160px] rounded" />}
            >
              <SwitchProfileButton />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="h-[40px] w-full rounded" />}>
        <SettingsTabWrapper />
      </Suspense>

      <div className="container mx-auto py-12">{children}</div>
    </>
  )
}

async function SettingsTabWrapper() {
  const user = await getCurrentUser()
  const plan = await getUserPlanUseCase(user!.id)
  return <SettingsTab hasSubscription={plan !== "free"} />
}

async function SwitchProfileButton() {
  const user = await getCurrentUser()
  return (
    <Button asChild className={btnStyles}>
      <Link href={`/users/${user!.id}`}>
        <SquareUser className={btnIconStyles} /> Switch to Profile
      </Link>
    </Button>
  )
}
