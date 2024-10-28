import { db } from "~/lib/db"
import { Group, GroupId, NewGroup, groups, memberships } from "~/lib/db/schema"
import { UserId } from "~/lib/use-cases/types"
import { and, count, eq, ilike, sql } from "drizzle-orm"
import { omit } from "~/utils/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function appendGroupMemberCount<T extends { memberships: any[] }>(group: T) {
  return omit(
    {
      ...group,
      memberCount: group.memberships.length + 1,
    },
    "memberships"
  )
}

export async function createGroup(group: NewGroup) {
  await db.insert(groups).values(group)
}

export async function searchPublicGroupsByName(search: string, page: number) {
  const GROUPS_PER_PAGE = 9

  const condition = search
    ? and(eq(groups.isPublic, true), ilike(groups.name, `%${search}%`))
    : eq(groups.isPublic, true)

  const userMemberships = await db.query.groups.findMany({
    where: condition,
    with: {
      memberships: true,
    },
    limit: GROUPS_PER_PAGE,
    offset: (page - 1) * GROUPS_PER_PAGE,
  })

  const [countResult] = await db
    .select({
      count: sql`count(*)`.mapWith(Number).as("count"),
    })
    .from(groups)
    .where(condition)

  return {
    data: userMemberships.map(appendGroupMemberCount),
    total: countResult.count,
    perPage: GROUPS_PER_PAGE,
  }
}

export async function getPublicGroupsByUser(userId: UserId) {
  const userGroups = await db.query.groups.findMany({
    where: and(eq(groups.userId, userId), eq(groups.isPublic, true)),
    with: {
      memberships: true,
    },
  })

  return userGroups.map(appendGroupMemberCount)
}

export async function countUserGroups(userId: UserId) {
  const [{ count: total }] = await db
    .select({ count: count() })
    .from(groups)
    .where(eq(groups.userId, userId))
  return total
}

export async function getGroupsByUser(userId: UserId) {
  const userGroups = await db.query.groups.findMany({
    where: eq(groups.userId, userId),
    with: {
      memberships: true,
    },
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

export async function getPublicGroupsByMembership(userId: UserId) {
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

  return userMemberships
    .filter((userMembership) => userMembership.groups.isPublic)
    .map((membership) => {
      const group = membership.groups
      return appendGroupMemberCount(group)
    })
}

export async function getGroupById(groupId: GroupId) {
  return await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  })
}

export async function updateGroup(
  groupId: GroupId,
  updatedGroup: Partial<Group>
) {
  await db.update(groups).set(updatedGroup).where(eq(groups.id, groupId))
}

export async function deleteGroup(groupId: GroupId) {
  await db.delete(groups).where(eq(groups.id, groupId))
}

export async function getGroupMembers(groupId: GroupId) {
  return await db.query.memberships.findMany({
    where: eq(memberships.groupId, groupId),
    with: {
      profiles: {
        columns: { displayName: true, image: true },
      },
    },
  })
}

export async function getGroupMembersCount(groupId: GroupId) {
  const [{ count: total }] = await db
    .select({ count: count() })
    .from(memberships)
    .where(eq(memberships.groupId, groupId))
  return total
}

export async function getUsersInGroup(groupId: GroupId) {
  return await db.query.memberships.findMany({
    where: eq(memberships.groupId, groupId),
  })
}
