import { ProfileTabs } from "~/app/[locale]/users/[userId]/profile-tabs"
import { cn } from "~/lib/utils"
import { pageWrapperStyles } from "~/styles/common"
import { ReactNode } from "react"
import { ProfileHeader } from "./profile-header"

export default async function ProfileLayout({
  params,
  children,
}: {
  params: { userId: string }
  children: ReactNode
}) {
  const { userId } = params
  console.log(params.userId)

  return (
    <>
      <ProfileHeader userId={parseInt(userId)} />

      <ProfileTabs userId={parseInt(userId)} />

      <div className={cn(pageWrapperStyles, "flex gap-12 space-y-0")}>
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </div>
    </>
  )
}
