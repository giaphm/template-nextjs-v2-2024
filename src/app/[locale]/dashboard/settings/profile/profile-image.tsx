import { Profile } from "~/lib/db/schema"
import { ProfileImageForm } from "./profile-image-form"
import { getCurrentUser } from "~/lib/auth"
import { getProfileImageUrl } from "~/lib/use-cases/users"
import Image from "next/image"
import { Skeleton } from "~/components/ui/skeleton"
import { Suspense } from "react"
import { getUserProfileLoader } from "./page"
import { ConfigurationPanel } from "~/components/configuration-panel"

export function getProfileImageFullUrl(profile: Profile) {
  return profile.imageId
    ? getProfileImageUrl(profile.userId, profile.imageId)
    : profile.image
      ? profile.image
      : "/profile.png"
}

export async function ProfileImage() {
  return (
    <ConfigurationPanel title="Profile Image">
      <Suspense fallback={<Skeleton className="h-[200px] w-full rounded" />}>
        <ProfileImageContent />
      </Suspense>
    </ConfigurationPanel>
  )
}

async function ProfileImageContent() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const profile = await getUserProfileLoader(user.id)

  return (
    <div className="flex flex-col sm:items-center">
      <Image
        src={getProfileImageFullUrl(profile)}
        width={200}
        height={200}
        className="mb-4 h-[200px] w-full rounded-xl object-cover sm:mb-6 sm:h-[100px]"
        alt="Profile image"
      />
      <ProfileImageForm />
    </div>
  )
}
