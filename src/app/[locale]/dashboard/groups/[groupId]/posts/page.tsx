import { getPostsInGroupUseCase } from "~/lib/use-cases/posts"
import Image from "next/image"
import { CreatePostButton } from "./create-post-button"
import { PostCard } from "./post-card"
import { Suspense } from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { isUserMemberOfGroupUseCase } from "~/lib/use-cases/memberships"
import { cn } from "~/lib/utils"
import { getCurrentUser } from "~/lib/auth"
import { cardStyles, pageTitleStyles } from "~/styles/common"

export default async function PostsPage({
  params,
}: {
  params: { groupId: string }
}) {
  const { groupId } = params

  const user = await getCurrentUser()
  const canPost = await isUserMemberOfGroupUseCase(user, parseInt(groupId))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className={pageTitleStyles}>Posts</h2>
        {canPost && <CreatePostButton />}
      </div>

      <Suspense fallback={<PostsListLoader />}>
        <PostsList groupId={groupId} />
      </Suspense>
    </div>
  )
}

function PostsListLoader() {
  return new Array(4).fill("").map((_, idx) => {
    return <Skeleton key={idx} className="h-40 w-full" />
  })
}

async function PostsList({ groupId }: { groupId: string }) {
  const user = await getCurrentUser()

  const posts = await getPostsInGroupUseCase(user, parseInt(groupId))

  return (
    <>
      {posts.length === 0 && (
        <div
          className={cn(
            cardStyles,
            "flex flex-col items-center justify-center gap-8 py-12"
          )}
        >
          <Image
            src="/empty-state/no-data.svg"
            width="200"
            height="200"
            alt="no image placeholder image"
          ></Image>
          <h2>No posts created yet</h2>
          <CreatePostButton />
        </div>
      )}
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))
      }
    </>
  )
}
