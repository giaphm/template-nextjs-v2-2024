"use client"

import * as React from "react"
import { memberships, type Membership } from "~/lib/db/schema"
import { type DataTableFilterField } from "~/types"

import { useDataTable } from "~/hooks/use-data-table"
import { DataTableAdvancedToolbar } from "~/components/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"

import { type getMemberships } from "../_lib/queries"
import { getRoleIcon } from "../_lib/utils"
import { getColumns } from "./memberships-table-columns"
import { MembershipsTableFloatingBar } from "./memberships-table-floating-bar"
import { useMembershipsTable } from "./memberships-table-provider"
import { MembershipsTableToolbarActions } from "./memberships-table-toolbar-actions"

interface MembershipsTableProps {
  membershipsPromise: ReturnType<typeof getMemberships>
}

export function MembershipsTable({
  membershipsPromise,
}: MembershipsTableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  const { featureFlags } = useMembershipsTable()

  const { data, pageCount } = React.use(membershipsPromise)

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
  const filterFields: DataTableFilterField<Membership>[] = [
    {
      label: "User id",
      value: "userId",
      placeholder: "Filter user id...",
    },
    {
      label: "Group id",
      value: "groupId",
      placeholder: "Filter group id...",
    },
    {
      label: "Role",
      value: "role",
      options: memberships.role.enumValues.map((role) => ({
        label: role[0]?.toUpperCase() + role.slice(1),
        value: role,
        icon: getRoleIcon(role),
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
          <MembershipsTableFloatingBar table={table} />
        ) : null
      }
    >
      <Toolbar table={table} filterFields={filterFields}>
        <MembershipsTableToolbarActions table={table} />
      </Toolbar>
    </DataTable>
  )
}
