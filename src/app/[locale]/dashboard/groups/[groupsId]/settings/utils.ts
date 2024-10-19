import { Group } from "~/lib/db"

export function getGroupImageUrl(group: Pick<Group, "id" | "bannerId">) {
  return `/api/groups/${group.id}/images/${group.bannerId ?? "default"}`
}
