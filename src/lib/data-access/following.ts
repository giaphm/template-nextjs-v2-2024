import { db } from "~/lib/db"
import { following } from "~/lib/db/schema"
import { UserId } from "~/lib/use-cases/types"
import { and, eq } from "drizzle-orm"

export async function createFollow(newFollow: {
  userId: UserId
  foreignUserId: UserId
}) {
  const [follow] = await db
    .insert(following)
    .values(newFollow)
    .onConflictDoNothing()
    .returning()
  return follow
}

export async function deleteFollow(userId: UserId, foreignUserId: UserId) {
  await db
    .delete(following)
    .where(
      and(
        eq(following.userId, userId),
        eq(following.foreignUserId, foreignUserId)
      )
    )
}

export async function getFollow(userId: UserId, foreignUserId: UserId) {
  return await db.query.following.findFirst({
    where: and(
      eq(following.userId, userId),
      eq(following.foreignUserId, foreignUserId)
    ),
  })
}

export async function getFollowersForUser(userId: UserId) {
  const followers = await db.query.following.findMany({
    where: eq(following.foreignUserId, userId),
    with: {
      userProfile: true,
    },
  })

  return followers.map((follow) => follow.userProfile)
}
