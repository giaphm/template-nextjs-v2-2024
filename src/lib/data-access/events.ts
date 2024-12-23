import { db } from "~/lib/db"
import { Event, GroupId, NewEvent, events } from "~/lib/db/schema"
import { asc, eq } from "drizzle-orm"

export async function createEvent(newEvent: {
  groupId: GroupId
  name: string
  description: string
  startsOn: Date
}) {
  const [event] = await db.insert(events).values(newEvent).returning()
  return event
}

export async function getEvent(eventId: Event["id"]) {
  return await db.query.events.findFirst({
    where: eq(events.id, eventId),
  })
}

export async function getEventsByGroupId(groupId: GroupId) {
  return await db.query.events.findMany({
    where: eq(events.groupId, groupId),
    orderBy: [asc(events.startsOn)],
  })
}

export async function updateEvent(
  eventId: Event["id"],
  updatedEvent: Partial<NewEvent>
) {
  await db.update(events).set(updatedEvent).where(eq(events.id, eventId))
}

export async function deleteEvent(eventId: Event["id"]) {
  await db.delete(events).where(eq(events.id, eventId))
}
