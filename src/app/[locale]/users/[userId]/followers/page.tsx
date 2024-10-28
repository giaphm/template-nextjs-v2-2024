import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import Link from "next/link"
import { Profile } from "~/lib/db/schema"
import { getFollowersForUserUseCase } from "~/lib/use-cases/following"
import Image from "next/image"

function FollowerCard({ profile }: { profile: Profile }) {
  return (
    <div key={profile.userId} className="flex items-center gap-4">
      <div className="flex items-center gap-4 rounded-lg border p-4 hover:underline dark:bg-slate-900">
        <Avatar>
          <AvatarImage src={profile.image || "/group.jpeg"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Link href={`/users/${profile.userId}/info`}>
          <p className="text-xl">{profile.displayName}</p>
        </Link>
      </div>
    </div>
  )
}

export default async function FollowersPage({
  params,
}: {
  params: { userId: string }
}) {
  const userId = parseInt(params.userId)
  const followers = await getFollowersForUserUseCase(userId)

  return (
    <div className="space-y-8">
      {followers.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-8 rounded-xl py-12 dark:bg-slate-900">
          <Image
            src="/empty-state/mountain.svg"
            width="200"
            height="200"
            alt="no gruops placeholder image"
          ></Image>
          <h2 className="text-2xl">This user no followers</h2>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {followers.map((follower) => (
          <FollowerCard key={follower.userId} profile={follower} />
        ))}
      </div>
    </div>
  )
}
