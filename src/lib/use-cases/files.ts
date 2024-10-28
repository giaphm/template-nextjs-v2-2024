import { getFileUrl } from "~/utils/files"
import { GroupId } from "../db"
import { assertGroupVisible } from "./authorization"
import { UserSession } from "./types"

export async function getGroupImageUrlUseCase(
  authenticatedUser: UserSession | undefined,
  { groupId, imageId }: { groupId: GroupId; imageId: string }
) {
  await assertGroupVisible(authenticatedUser, groupId)

  const url = await getFileUrl({
    key: getGroupImageKey(groupId, imageId),
  })

  return url
}

export function getGroupImageKey(groupId: GroupId, imageId: string) {
  return `groups/${groupId}/images/${imageId}`
}
