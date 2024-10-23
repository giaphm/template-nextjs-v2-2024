"use client"

import { type Profile } from "~/lib/db/schema"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "~/utils/export"
import { Button } from "~/components/ui/button"

import { CreateProfileDialog } from "./create-profile-dialog"
import { DeleteProfilesDialog } from "./delete-profiles-dialog"

interface ProfilesTableToolbarActionsProps {
  table: Table<Profile>
}

export function ProfilesTableToolbarActions({
  table,
}: ProfilesTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteProfilesDialog
          profiles={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateProfileDialog />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "profiles",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  )
}
