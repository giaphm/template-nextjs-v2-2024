import { ProfileImage } from "~/app/[locale]/dashboard/settings/profile/profile-image"
import { ProfileName } from "~/app/[locale]/dashboard/settings/profile/profile-name"
import { EditBioForm } from "./edit-bio-form"
import { Suspense, cache } from "react"
import { getUserProfileUseCase } from "~/lib/use-cases/users"
import { Skeleton } from "~/components/ui/skeleton"
import { ConfigurationPanel } from "~/components/configuration-panel"
import { assertAuthenticated } from "~/lib/auth"
import { ThemeToggle } from "~/components/theme-toggle"

export const getUserProfileLoader = cache(getUserProfileUseCase)

export default async function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <ProfileImage />
        <ProfileName />
      </div>

      <ConfigurationPanel title="Profile Bio">
        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded" />}>
          <BioFormWrapper />
        </Suspense>
      </ConfigurationPanel>

      <ConfigurationPanel title="Theme">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <span className="mb-2 sm:mb-0">Toggle dark mode</span>
          <ThemeToggle />
        </div>
      </ConfigurationPanel>
    </div>
  )
}

export async function BioFormWrapper() {
  const user = await assertAuthenticated()
  const profile = await getUserProfileLoader(user.id)
  return <EditBioForm bio={profile.bio} />
}
