"use client"

import * as React from "react"
import { accounts, type Account } from "~/lib/db/schema"
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

import { updateAccountTypeAccount } from "../_lib/actions"
import { DeleteAccountsDialog } from "./delete-accounts-dialog"
import { UpdateAccountSheet } from "./update-account-sheet"

export function getColumns(): ColumnDef<Account>[] {
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
      cell: ({ row }) => {
        const accountType = accounts.accountType.enumValues.find(
          (accountType) => accountType === row.original.accountType
        )

        return (
          <div className="flex space-x-2">
            {accountType && <Badge variant="outline">{accountType}</Badge>}
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.getValue("userId")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "accountType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Github id" />
      ),
      cell: ({ row }) => (
        <div className="w-20">{row.getValue("accountType")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "githubId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Github id" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("githubId")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "googleId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Google id" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue("googleId")}</div>,
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
      accessorKey: "updatedOn",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated On" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showUpdateAccountSheet, setShowUpdateAccountSheet] =
          React.useState(false)
        const [showDeleteAccountDialog, setShowDeleteAccountDialog] =
          React.useState(false)

        return (
          <>
            <UpdateAccountSheet
              open={showUpdateAccountSheet}
              onOpenChange={setShowUpdateAccountSheet}
              account={row.original}
            />
            <DeleteAccountsDialog
              open={showDeleteAccountDialog}
              onOpenChange={setShowDeleteAccountDialog}
              accounts={[row.original]}
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
                  onSelect={() => setShowUpdateAccountSheet(true)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Account type</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.accountType}
                      onValueChange={(value) => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateAccountTypeAccount({
                              id: row.original.id,
                              accountType: value as Account["accountType"],
                            }),
                            {
                              loading: "Updating...",
                              success: "Label updated",
                              error: (err) => getErrorMessage(err),
                            }
                          )
                        })
                      }}
                    >
                      {accounts.accountType.enumValues.map((accountType) => (
                        <DropdownMenuRadioItem
                          key={accountType}
                          value={accountType}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {accountType}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteAccountDialog(true)}
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
