import { Button } from "~/components/ui/button"
import { headerStyles, pageTitleStyles } from "~/styles/common"
import { btnIconStyles, btnStyles } from "~/styles/icons"
import { getUserProfileUseCase } from "~/lib/use-cases/users"
import { SquareUser } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FollowButton } from "./follow-button"
import { isFollowingUserUseCase } from "~/lib/use-cases/following"
import { UnfollowButton } from "./unfollow-button"
import { cn } from "~/lib/utils"
import { UserId } from "~/lib/use-cases/types"
import { getCurrentUser } from "~/lib/auth"

export async function ProfileHeader({ userId }: { userId: UserId }) {
  const user = await getCurrentUser()
  const profile = await getUserProfileUseCase(userId)
  const isOwnProfile = user?.id === userId

  const isFollowingUser = user
    ? await isFollowingUserUseCase(user, userId)
    : false

  const shouldShowFollowButtons = user && !isOwnProfile

  return (
    <div className={cn(headerStyles, "py-8")}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <Image
              src={profile.image ?? "/group.jpeg"}
              width={60}
              height={60}
              alt="image of the group"
              className="h-[60px] rounded-full object-cover"
            />

            <h1 className={pageTitleStyles}>{profile.displayName} </h1>
          </div>

          {shouldShowFollowButtons &&
            (isFollowingUser ? (
              <UnfollowButton foreignUserId={userId} />
            ) : (
              <FollowButton foreignUserId={userId} />
            ))}

          {isOwnProfile && (
            <Button asChild className={btnStyles}>
              <Link href={`/dashboard/settings/profile`}>
                <SquareUser className={btnIconStyles} /> Edit your Profile
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
