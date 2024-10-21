"use client"

import * as React from "react"
import { type User } from "~/lib/db"
import { type DataTableFilterField } from "~/types"

import { DataTableAdvancedToolbar } from "~/components/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { useDataTable } from "~/hooks/use-data-table"

import { type getUsers } from "../_lib/queries"
import { getColumns } from "./users-table-columns"
import { TasksTableFloatingBar } from "./users-table-floating-bar"
import { useUsersTable } from "./users-table-provider"
import { TasksTableToolbarActions } from "./users-table-toolbar-actions"

interface TasksTableProps {
  usersPromise: ReturnType<typeof getUsers>
}

export function UsersTable({ usersPromise }: TasksTableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  const { featureFlags } = useUsersTable()

  const { data, pageCount } = React.use(usersPromise)

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => getColumns(), [])

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<User>[] = [
    {
      label: "Filter email...",
      value: "email",
      placeholder: "Filter email...",
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: featureFlags.includes("advancedFilter"),
    initialState: {
      sorting: [{ id: "createdOn", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  })

  const Toolbar = featureFlags.includes("advancedFilter")
    ? DataTableAdvancedToolbar
    : DataTableToolbar

  return (
    <DataTable
      table={table}
      floatingBar={
        featureFlags.includes("floatingBar") ? (
          <TasksTableFloatingBar table={table} />
        ) : null
      }
    >
      <Toolbar table={table} filterFields={filterFields}>
        <TasksTableToolbarActions table={table} />
      </Toolbar>
    </DataTable>
  )
}
