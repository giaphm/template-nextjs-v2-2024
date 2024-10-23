"use client"

import { type ColumnDef } from "@tanstack/react-table"
import * as React from "react"
import { type Profile } from "~/lib/db/schema"

import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { Checkbox } from "~/components/ui/checkbox"
import { formatDate } from "~/lib/utils"

import { DeleteProfilesDialog } from "./delete-profiles-dialog"
import { UpdateProfileSheet } from "./update-profile-sheet"

export function getColumns(): ColumnDef<Profile>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "userId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User id" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("userId")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "displayName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Display name" />
      ),
      cell: ({ row }) => (
        <div className="w-20">{row.getValue("displayName")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "imageId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image id" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("imageId")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("image")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "bio",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bio" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("bio")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "createdOn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created On" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [showUpdateProfileSheet, setShowUpdateProfileSheet] =
          React.useState(false)
        const [showDeleteProfileDialog, setShowDeleteProfileDialog] =
          React.useState(false)

        return (
          <>
            <UpdateProfileSheet
              open={showUpdateProfileSheet}
              onOpenChange={setShowUpdateProfileSheet}
              profile={row.original}
            />
            <DeleteProfilesDialog
              open={showDeleteProfileDialog}
              onOpenChange={setShowDeleteProfileDialog}
              profiles={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
          </>
        )
      },
      size: 40,
    },
  ]
}
