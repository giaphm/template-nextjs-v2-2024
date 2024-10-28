import { db } from "~/lib/db"
import { Membership, memberships } from "~/lib/db/schema"
import { UserId } from "~/lib/use-cases/types"
import { and, eq } from "drizzle-orm"

export async function getMembership(userId: UserId, groupId: number) {
  return await db.query.memberships.findFirst({
    where: and(
      eq(memberships.userId, userId),
      eq(memberships.groupId, groupId)
    ),
  })
}

export async function removeMembership(userId: UserId, groupId: number) {
  await db
    .delete(memberships)
    .where(
      and(eq(memberships.userId, userId), eq(memberships.groupId, groupId))
    )
}

export async function addMembership(userId: UserId, groupId: number) {
  await db.insert(memberships).values({
    userId,
    groupId,
  })
}

export async function getMembershipsByUserId(userId: UserId) {
  return await db.query.memberships.findMany({
    where: eq(memberships.userId, userId),
  })
}

export async function updateMembership(
  membershipId: number,
  updatedMembership: Partial<Membership>
) {
  await db
    .update(memberships)
    .set(updatedMembership)
    .where(eq(memberships.id, membershipId))
}
