import { getCurrentUser } from "~/lib/auth/auth"
import { cn } from "~/lib/utils"
import { cardStyles, pageTitleStyles } from "~/styles/common"
import { getEventsUseCase } from "~/lib/use-cases/events"
import Image from "next/image"
import { EventCard } from "./event-card"
import { CreateEventButton } from "./create-event-button"
import { AlarmCheckIcon, DoorClosed } from "lucide-react"
import { isGroupOwnerUseCase } from "~/lib/use-cases/memberships"

export default async function MembersPage({
  params,
}: {
  params: { groupId: string }
}) {
  const user = await getCurrentUser()
  const groupId = parseInt(params.groupId)

  const events = await getEventsUseCase(user, groupId)
  const isGroupOwner = await isGroupOwnerUseCase(user, groupId)

  const upcomingEvents = events.filter((event) => {
    return new Date(event.startsOn) > new Date()
  })

  const pastEvents = events.filter((event) => {
    return new Date(event.startsOn) < new Date()
  })

  return (
    <>
      <div className="space-y-8">
        <h2
          className={cn(pageTitleStyles, "flex items-center justify-between")}
        >
          Events
          {isGroupOwner && <CreateEventButton />}
        </h2>

        {events.length === 0 && (
          <div
            className={cn(
              cardStyles,
              "flex flex-col items-center justify-center gap-8 p-12"
            )}
          >
            <Image
              src="/empty-state/no-data.svg"
              width="200"
              height="200"
              alt="no image placeholder image"
            ></Image>
            <h2>No events created yet</h2>
          </div>
        )}

        {events.length > 0 && (
          <div className="space-y-24">
            <div className="space-y-8">
              <h3
                className={cn(
                  pageTitleStyles,
                  "flex items-center justify-between text-2xl"
                )}
              >
                <div className="flex items-center gap-4">
                  <AlarmCheckIcon className="h-6 w-6" /> Upcoming
                </div>
              </h3>

              {upcomingEvents.length === 0 && (
                <p
                  className={cn(
                    cardStyles,
                    "mt-8 flex items-center gap-8 px-4 py-4"
                  )}
                >
                  No upcoming events found
                </p>
              )}

              <div className="space-y-8">
                {upcomingEvents.map((event, idx) => (
                  <EventCard key={idx} isAdmin={isGroupOwner} event={event} />
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3
                className={cn(
                  pageTitleStyles,
                  "flex items-center justify-between text-2xl"
                )}
              >
                <div className="flex items-center gap-4">
                  <DoorClosed className="h-6 w-6" /> Expired
                </div>
              </h3>

              {pastEvents.length === 0 && (
                <p
                  className={cn(
                    cardStyles,
                    "mt-8 flex items-center gap-8 px-4 py-4"
                  )}
                >
                  No expired events found
                </p>
              )}

              <div className="space-y-8">
                {pastEvents.map((event, idx) => (
                  <EventCard key={idx} isAdmin={isGroupOwner} event={event} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
