"use client"

import * as React from "react"
import { memberships, type Membership } from "~/lib/db/schema"
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

import { updateMembership } from "../_lib/actions"
import { getRoleIcon } from "../_lib/utils"
import { DeleteMembershipsDialog } from "./delete-memberships-dialog"
import { UpdateMembershipSheet } from "./update-membership-sheet"

export function getColumns(): ColumnDef<Membership>[] {
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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Membership id" />
      ),
      cell: ({ row }) => {
        const role = memberships.role.enumValues.find(
          (role) => role === row.original.role
        )

        return (
          <div className="flex space-x-2">
            {role && <Badge variant="outline">{role}</Badge>}
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("role")}
            </span>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "userId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User id" />
      ),
      cell: ({ row }) => {
        return <div className="w-20">{row.getValue("userId")}</div>
      },
    },
    {
      accessorKey: "groupId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="group id" />
      ),
      cell: ({ row }) => {
        return <div className="w-20">{row.getValue("groupId")}</div>
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = memberships.role.enumValues.find(
          (role) => role === row.original.role
        )

        if (!role) return null

        const Icon = getRoleIcon(role)

        return (
          <div className="flex w-[6.25rem] items-center">
            <Icon
              className="mr-2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="capitalize">{role}</span>
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
        const [showUpdateMembershipSheet, setShowUpdateMembershipSheet] =
          React.useState(false)
        const [showDeleteMembershipDialog, setShowDeleteMembershipDialog] =
          React.useState(false)

        return (
          <>
            <UpdateMembershipSheet
              open={showUpdateMembershipSheet}
              onOpenChange={setShowUpdateMembershipSheet}
              membership={row.original}
            />
            <DeleteMembershipsDialog
              open={showDeleteMembershipDialog}
              onOpenChange={setShowDeleteMembershipDialog}
              memberships={[row.original]}
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
                  onSelect={() => setShowUpdateMembershipSheet(true)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.role}
                      onValueChange={(value) => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateMembership({
                              id: row.original.id,
                              role: value as Membership["role"],
                            }),
                            {
                              loading: "Updating...",
                              success: "Role updated",
                              error: (err) => getErrorMessage(err),
                            }
                          )
                        })
                      }}
                    >
                      {memberships.role.enumValues.map((role) => (
                        <DropdownMenuRadioItem
                          key={role}
                          value={role}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {role}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteMembershipDialog(true)}
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
