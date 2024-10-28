import { Event, Group } from "~/lib/db"

export function getGroupImageUrl(group: Pick<Group, "id" | "bannerId">) {
  return `/api/groups/${group.id}/images/${group.bannerId ?? "default"}`
}

export function getEventImageUrl(event: Event) {
  return `/api/groups/${event.groupId}/images/${event.imageId ?? "default"}`
}
