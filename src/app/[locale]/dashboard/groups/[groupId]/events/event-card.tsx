"use client"

import { Event } from "~/lib/db/schema"
import { getEventImageUrl } from "../settings/util"
import Image from "next/image"
import { format } from "date-fns"
import { EventCardActions } from "./event-card-actions"
import { cn } from "~/lib/utils"
import { cardStyles } from "~/styles/common"

export function EventCard({
  event,
  isAdmin,
}: {
  event: Event
  isAdmin: boolean
}) {
  return (
    <div key={event.id} className={cn(cardStyles, "space-y-4 p-4 sm:p-8")}>
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <Image
          src={getEventImageUrl(event)}
          width={300}
          height={200}
          alt="image of the event"
          className="max-h-[100px] w-full rounded-lg object-cover sm:max-h-[200px] sm:w-auto"
        />
        <div className="flex flex-1 flex-col gap-2 sm:gap-4">
          <h2 className="text-xl font-semibold sm:text-2xl">{event.name}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
            {format(event.startsOn, "PPp")}
          </p>
          <p className="text-sm sm:text-base">{event.description}</p>
        </div>

        {isAdmin && (
          <div className="mt-4 sm:mt-0">
            <EventCardActions event={event} />
          </div>
        )}
      </div>
    </div>
  )
}
