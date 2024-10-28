import { cardStyles, linkStyles, pageTitleStyles } from "~/styles/common"
import { canEditPostUseCase, getPostByIdUseCase } from "~/lib/use-cases/posts"
import { DeletePostButton } from "../delete-post-button"
import { EditPostForm } from "./edit-post-form"
import {
  getRepliesForPostUseCase,
  hasAccessToMutateReplyUseCase,
} from "~/lib/use-cases/replies"
import { Suspense } from "react"
import { PostReplyForm } from "./post-reply-form"
import { GroupId, Reply } from "~/lib/db/schema"
import { getUserProfileUseCase } from "~/lib/use-cases/users"
import { getProfileImageFullUrl } from "~/app/[locale]/dashboard/settings/profile/profile-image"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Skeleton } from "~/components/ui/skeleton"
import { isUserMemberOfGroupUseCase } from "~/lib/use-cases/memberships"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { cn, formatDate } from "~/lib/utils"
import { ReplyActions } from "./reply-actions"
import { getCurrentUser } from "~/lib/auth"

export default async function PostPage({
  params,
}: {
  params: { postId: string; groupId: string }
}) {
  const { postId, groupId } = params

  const user = await getCurrentUser()
  const post = await getPostByIdUseCase(user, parseInt(postId))
  const isPostAdmin = await canEditPostUseCase(user, parseInt(postId))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Button asChild>
          <Link href={`/dashboard/groups/${groupId}/posts`}>
            <ChevronLeft /> Back to Posts
          </Link>
        </Button>

        {isPostAdmin && <DeletePostButton postId={post.id} />}
      </div>

      {!isPostAdmin && <h2 className={pageTitleStyles}>{post.title}</h2>}

      {isPostAdmin ? <EditPostForm post={post} /> : <p>{post.message}</p>}

      <h2 className="text-2xl" id="replies">
        Replies
      </h2>

      <Suspense>
        <RepliesList groupId={parseInt(groupId)} postId={post.id} />
      </Suspense>
    </div>
  )
}

async function ReplyAvatar({ userId }: { userId: number }) {
  const profile = await getUserProfileUseCase(userId)

  return (
    <Link
      scroll={false}
      className={cn(linkStyles, "flex items-center gap-2")}
      href={`/users/${profile.userId}/info`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={getProfileImageFullUrl(profile)} />
        <AvatarFallback>
          {profile.displayName?.substring(0, 2).toUpperCase() ?? "AA"}
        </AvatarFallback>
      </Avatar>

      <p>{profile.displayName}</p>
    </Link>
  )
}

function ReplyAvatarFallback() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-6 w-20" />
    </div>
  )
}

async function RepliesList({
  postId,
  groupId,
}: {
  postId: number
  groupId: GroupId
}) {
  const user = await getCurrentUser()

  const replies = await getRepliesForPostUseCase(user, postId)
  const isMember = await isUserMemberOfGroupUseCase(user, groupId)

  return (
    <div className="flex flex-col gap-4">
      {replies.map((reply, idx) => (
        <ReplyCard key={idx} reply={reply} />
      ))}

      {isMember && <PostReplyForm groupId={groupId} postId={postId} />}
    </div>
  )
}

async function ReplyCard({ reply }: { reply: Reply }) {
  const user = await getCurrentUser()
  const hasMutateAccess = await hasAccessToMutateReplyUseCase(user, reply.id)

  return (
    <div key={reply.id} className={cn(cardStyles, "relative space-y-3 p-4")}>
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-0">
        <div className="flex flex-wrap items-center gap-4">
          <Suspense fallback={<ReplyAvatarFallback />}>
            <ReplyAvatar userId={reply.userId} />
          </Suspense>
          <div className="text-sm">{formatDate(reply.createdOn)}</div>
        </div>

        {hasMutateAccess && (
          <div className="absolute right-2 top-2">
            <ReplyActions reply={reply} />
          </div>
        )}
      </div>

      <p className="break-words">{reply.message}</p>
    </div>
  )
}
