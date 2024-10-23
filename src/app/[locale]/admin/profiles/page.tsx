import React, { memo } from "react"
import { type SearchParams } from "~/types"

import { Skeleton } from "~/components/ui/skeleton"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { DateRangePicker } from "~/components/date-range-picker"

import { ProfilesTable } from "./_components/profiles-table"
import { ProfilesTableProvider } from "./_components/profiles-table-provider"
import { getProfiles } from "./_lib/queries"
import { searchParamsSchema } from "./_lib/validations"

export interface IndexPageProps {
  searchParams: SearchParams
}

function ProfileManagementPage({ searchParams }: IndexPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const profilesPromise = getProfiles(search)

  return (
    <div className="p-5">
      {/**
       * The `UsersTableProvider` is use to enable some feature flags for the `TasksTable` component.
       * Feel free to remove this, as it's not required for the `TasksTable` component to work.
       */}
      <ProfilesTableProvider>
        {/**
         * The `DateRangePicker` component is used to render the date range picker UI.
         * It is used to filter the tasks based on the selected date range it was created at.
         * The business logic for filtering the tasks based on the selected date range is handled inside the component.
         */}
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
            shallow={false}
          />
        </React.Suspense>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {/**
           * Passing promises and consuming them using React.use for triggering the suspense fallback.
           * @see https://react.dev/reference/react/use
           */}
          <ProfilesTable profilesPromise={profilesPromise} />
        </React.Suspense>
      </ProfilesTableProvider>
    </div>
  )
}
export default memo(ProfileManagementPage)
