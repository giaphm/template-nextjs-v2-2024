"use client"

import { type Group } from "~/lib/db/schema"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { exportTableToCSV } from "~/utils/export"
import { Button } from "~/components/ui/button"

import { CreateGroupDialog } from "./create-group-dialog"
import { DeleteGroupsDialog } from "./delete-groups-dialog"

interface GroupsTableToolbarActionsProps {
  table: Table<Group>
}

export function GroupsTableToolbarActions({
  table,
}: GroupsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteGroupsDialog
          groups={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateGroupDialog />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
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
