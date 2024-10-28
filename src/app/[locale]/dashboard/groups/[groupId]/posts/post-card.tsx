import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Post } from "~/lib/db/schema"
import { canEditPostUseCase } from "~/lib/use-cases/posts"
import { getReplyCountUseCase } from "~/lib/use-cases/replies"
import { getUserProfileUseCase } from "~/lib/use-cases/users"
import { getProfileImageFullUrl } from "~/app/[locale]/dashboard/settings/profile/profile-image"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Suspense } from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { cardStyles, linkStyles } from "~/styles/common"
import { cn } from "~/lib/utils"
import { getCurrentUser } from "~/lib/auth"
import { formatDate } from "~/utils/date"

function PostAvatarFallback() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-6 w-20" />
    </div>
  )
}

async function PostAvatar({ userId }: { userId: number }) {
  const profile = await getUserProfileUseCase(userId)

  return (
    <Link
      scroll={false}
      className={cn(linkStyles, "flex items-center gap-2")}
      href={`/users/${userId}/info`}
    >
      <Avatar className="size-6">
        <AvatarImage src={getProfileImageFullUrl(profile)} />
        <AvatarFallback>
          {profile.displayName?.substring(0, 2).toUpperCase() ?? "AA"}
        </AvatarFallback>
      </Avatar>

      <p>{profile.displayName}</p>
    </Link>
  )
}

export async function PostCard({ post }: { post: Post }) {
  const user = await getCurrentUser()

  const canDeletePost = await canEditPostUseCase(user, post.id)
  const replyCount = await getReplyCountUseCase(user, post.id)

  return (
    <div className={cn(cardStyles, "flex flex-col gap-4 border p-4")}>
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">
          <Link
            className={linkStyles}
            href={`/dashboard/groups/${post.groupId}/posts/${post.id}`}
          >
            {post.title}
          </Link>
        </h3>
      </div>

      <p>{post.message}</p>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:gap-0">
        <div className="flex w-full flex-wrap items-center gap-2 text-gray-400 sm:gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MessageCircle className="h-4 w-4" /> {replyCount}
          </div>
          <div className="hidden sm:block">|</div>

          <Suspense fallback={<PostAvatarFallback />}>
            <PostAvatar userId={post.userId} />
          </Suspense>

          <div className="text-sm"> {formatDate(post.createdOn)}</div>
        </div>

        {canDeletePost ? (
          <Button asChild className="w-full sm:w-fit">
            <Link href={`/dashboard/groups/${post.groupId}/posts/${post.id}`}>
              Manage post...
            </Link>
          </Button>
        ) : (
          <Button asChild className="w-full sm:w-fit" variant={"secondary"}>
            <Link href={`/dashboard/groups/${post.groupId}/posts/${post.id}`}>
              Read post...
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
