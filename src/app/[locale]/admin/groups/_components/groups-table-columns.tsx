"use client"

import * as React from "react"
import { type Group } from "~/lib/db/schema"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { getErrorMessage } from "~/utils/handle-errors"
import { formatDate } from "~/lib/utils"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"

import { updateGroup } from "../_lib/actions"
import { getIsPublicIcon } from "../_lib/utils"
import { DeleteGroupsDialog } from "./delete-groups-dialog"
import { UpdateGroupSheet } from "./update-group-sheet"

export function getColumns(): ColumnDef<Group>[] {
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const isPublic = row.getValue("isPublic") ? "true" : "false"

        return (
          <div className="flex space-x-2">
            <Badge variant="outline">{isPublic}</Badge>
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("isPublic")}
            </span>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "isPublic",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Is Public" />
      ),
      cell: ({ row }) => {
        const isPublic = row.getValue("isPublic") as boolean

        const Icon = getIsPublicIcon(isPublic)

        return (
          <div className="flex w-[6.25rem] items-center">
            <Icon
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="capitalize">{isPublic}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
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
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showUpdateGroupSheet, setShowUpdateGroupSheet] =
          React.useState(false)
        const [showDeleteGroupDialog, setShowDeleteGroupDialog] =
          React.useState(false)

        return (
          <>
            <UpdateGroupSheet
              open={showUpdateGroupSheet}
              onOpenChange={setShowUpdateGroupSheet}
              group={row.original}
            />
            <DeleteGroupsDialog
              open={showDeleteGroupDialog}
              onOpenChange={setShowDeleteGroupDialog}
              groups={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => setShowUpdateGroupSheet(true)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.isPublic ? "true" : "false"}
                      onValueChange={(value) => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateGroup({
                              id: row.original.id,
                              isPublic: value as unknown as Group["isPublic"],
                            }),
                            {
                              loading: "Updating...",
                              success: "isPublic updated",
                              error: (err) => getErrorMessage(err),
                            }
                          )
                        })
                      }}
                    >
                      {["true", "false"].map((isPublic) => (
                        <DropdownMenuRadioItem
                          key={isPublic}
                          value={isPublic}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {isPublic}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteGroupDialog(true)}
                >
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
      size: 40,
    },
  ]
}
