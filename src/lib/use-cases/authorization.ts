import { getGroupById } from "../data-access/groups"
import { getMembership } from "../data-access/memberships"
import { GroupId } from "../db"
import { AuthenticationError, NotFoundError } from "./errors"
import { UserSession } from "./types"

export async function assertGroupVisible(
  user: UserSession | undefined,
  groupId: GroupId
) {
  if (!user) {
    throw new AuthenticationError()
  }

  const group = await assertGroupExists(groupId)

  if (group.isPublic) {
    return { group, user }
  }

  const membership = await getMembership(user.id, groupId)

  const isGroupOwner = group.userId === user.id
  if (!membership && !isGroupOwner) {
    throw new AuthenticationError()
  }

  return { group, user }
}

export async function assertGroupExists(groupId: GroupId) {
  const group = await getGroupById(groupId)

  if (!group) {
    throw new NotFoundError("Group not found")
  }

  return group
}
