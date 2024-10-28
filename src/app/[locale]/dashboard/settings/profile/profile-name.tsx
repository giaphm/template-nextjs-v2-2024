import { ConfigurationPanel } from "~/components/configuration-panel"
import { ProfileNameForm } from "./profile-name-form"
import { Suspense } from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { getUserProfileLoader } from "./page"
import { getCurrentUser } from "~/lib/auth"

export async function ProfileName() {
  return (
    <ConfigurationPanel title="Display Name">
      <Suspense fallback={<Skeleton className="h-[200px] w-full rounded" />}>
        <ProfileNameWrapper />
      </Suspense>
    </ConfigurationPanel>
  )
}

async function ProfileNameWrapper() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const profile = await getUserProfileLoader(user.id)

  return <ProfileNameForm profileName={profile.displayName ?? ""} />
}
