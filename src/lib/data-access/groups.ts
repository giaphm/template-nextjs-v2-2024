import { count, eq } from "drizzle-orm"
import { db, Group, groups, memberships, NewGroup } from "../db"
import { UserId } from "../use-cases/types"
import { omit } from "~/utils/utils"

function appendGroupMemberCount<
  T extends { memberships: (typeof memberships.$inferSelect)[] },
>(group: T) {
  return omit(
    {
      ...group,
      memberCount: group.memberships.length + 1,
    },
    "memberships"
  )
}

export async function getGroupsByUser(userId: UserId) {
  const userGroups = await db.query.groups.findMany({
    where: eq(groups.userId, userId),
    with: { memberships: true },
  })

  return userGroups.map(appendGroupMemberCount)
}

export async function getGroupsByMembership(userId: UserId) {
  const userMemberships = await db.query.memberships.findMany({
    where: eq(memberships.userId, userId),
    with: {
      groups: {
        with: {
          memberships: true,
        },
      },
    },
  })

  return userMemberships.map((membership) => {
    const group = membership.groups
    return appendGroupMemberCount(group)
  })
}

export async function countUserGroups(userId: UserId) {
  const [{ count: total }] = await db
    .select({ count: count() })
    .from(groups)
    .where(eq(groups.userId, userId))

  return total
}

export async function createGroup(group: NewGroup) {
  await db.insert(groups).values(group)
}

export async function getGroupById(groupId: Group["id"]) {
  return await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  })
}
