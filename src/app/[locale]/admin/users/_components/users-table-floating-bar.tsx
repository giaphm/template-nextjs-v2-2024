import {
  CalendarIcon,
  Cross2Icon,
  DownloadIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import * as React from "react"
import { type User } from "~/lib/db"

import { Kbd } from "~/components/kbd"
import { Button } from "~/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { exportTableToCSV } from "~/utils/export"

import { Calendar } from "~/components/ui/calendar"
import { updateUsers } from "../_lib/actions"
import { useToast } from "~/hooks/use-toast"
import { DeleteUsersDialog } from "./delete-users-dialog"

interface TasksTableFloatingBarProps {
  table: Table<User>
}

export function TasksTableFloatingBar({ table }: TasksTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const [isPending, startTransition] = React.useTransition()
  const [method, setMethod] = React.useState<
    "update-email-verified" | "export" | "delete"
  >()
  const { toast } = useToast()
  const [showDeleteUserDialog, setShowDeleteUserDialog] = React.useState(false)

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [table])

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
      <div className="w-full overflow-x-auto">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
          <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
            <span className="whitespace-nowrap text-xs">
              {rows.length} selected
            </span>
            <Separator orientation="vertical" className="ml-2 mr-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-5 hover:border"
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <Cross2Icon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                <p className="mr-2">Clear selection</p>
                <Kbd abbrTitle="Escape" variant="outline">
                  Esc
                </Kbd>
              </TooltipContent>
            </Tooltip>
          </div>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <div className="flex items-center gap-1.5">
            <Popover>
              <Tooltip delayDuration={250}>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                      disabled={isPending}
                    >
                      {isPending && method === "update-email-verified" ? (
                        <ReloadIcon
                          className="size-3.5 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <CalendarIcon className="size-3.5" aria-hidden="true" />
                      )}
                    </Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <p>Update status</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={(value: User["emailVerified"] | undefined) => {
                    setMethod("update-email-verified")

                    startTransition(async () => {
                      const { error } = await updateUsers({
                        ids: rows.map((row) => row.original.id),
                        emailVerified: value,
                      })

                      if (error) {
                        toast({
                          title: "Error",
                          description: "Cannot update email verified",
                          variant: "destructive",
                        })
                        return
                      }

                      toast({
                        title: "Success",
                        description: "Users updated",
                        variant: "default",
                      })
                    })
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-7 border"
                  onClick={() => {
                    setMethod("export")

                    startTransition(() => {
                      exportTableToCSV(table, {
                        excludeColumns: ["select", "actions"],
                        onlySelected: true,
                      })
                    })
                  }}
                  disabled={isPending}
                >
                  {isPending && method === "export" ? (
                    <ReloadIcon
                      className="size-3.5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <DownloadIcon className="size-3.5" aria-hidden="true" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                <p>Export users</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip delayDuration={250}>
              <TooltipTrigger asChild>
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-7 border"
                    onClick={() => {
                      setMethod("delete")

                      startTransition(async () => {
                        setShowDeleteUserDialog(true)
                      })
                    }}
                    disabled={isPending}
                  >
                    {isPending && method === "delete" ? (
                      <ReloadIcon
                        className="size-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <TrashIcon className="size-3.5" aria-hidden="true" />
                    )}
                  </Button>
                  <DeleteUsersDialog
                    users={table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original)}
                    onSuccess={() => table.toggleAllRowsSelected(false)}
                    showTrigger={false}
                    open={showDeleteUserDialog}
                    onOpenChange={setShowDeleteUserDialog}
                  />
                </>
              </TooltipTrigger>
              <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                <p>Delete users</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}
