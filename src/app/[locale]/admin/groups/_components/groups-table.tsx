"use client"

import * as React from "react"
import { type Group } from "~/lib/db/schema"
import { type DataTableFilterField } from "~/types"

import { useDataTable } from "~/hooks/use-data-table"
import { DataTableAdvancedToolbar } from "~/components/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"

import { type getGroups } from "../_lib/queries"
import { getIsPublicIcon } from "../_lib/utils"
import { getColumns } from "./groups-table-columns"
import { GroupsTableFloatingBar } from "./groups-table-floating-bar"
import { useGroupsTable } from "./groups-table-provider"
import { GroupsTableToolbarActions } from "./groups-table-toolbar-actions"

interface GroupsTableProps {
  groupsPromise: ReturnType<typeof getGroups>
}

export function GroupsTable({ groupsPromise }: GroupsTableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  const { featureFlags } = useGroupsTable()

  const { data, pageCount } = React.use(groupsPromise)

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
  const filterFields: DataTableFilterField<Group>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "Filter names...",
    },
    {
      label: "Description",
      value: "description",
      placeholder: "Filter descriptions...",
    },
    {
      label: "Is public?",
      value: "isPublic",
      options: ["true", "false"].map((value) => ({
        label: value[0]?.toUpperCase() + value.slice(1),
        value: value,
        icon: getIsPublicIcon(Boolean(value)),
        withCount: true,
      })),
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
          <GroupsTableFloatingBar table={table} />
        ) : null
      }
    >
      <Toolbar table={table} filterFields={filterFields}>
        <GroupsTableToolbarActions table={table} />
      </Toolbar>
    </DataTable>
  )
}
