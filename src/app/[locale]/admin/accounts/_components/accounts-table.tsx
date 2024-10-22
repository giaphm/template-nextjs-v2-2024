"use client"

import * as React from "react"
import { accounts, type Account } from "~/lib/db/schema"
import { type DataTableFilterField } from "~/types"

import { useDataTable } from "~/hooks/use-data-table"
import { DataTableAdvancedToolbar } from "~/components/data-table/advanced/data-table-advanced-toolbar"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"

import { type getAccounts } from "../_lib/queries"
import { getAccountTypeIcon } from "../_lib/utils"
import { getColumns } from "./accounts-table-columns"
import { AccountsTableFloatingBar } from "./accounts-table-floating-bar"
import { useAccountsTable } from "./accounts-table-provider"
import { AccountsTableToolbarActions } from "./accounts-table-toolbar-actions"

interface AccountsTableProps {
  accountsPromise: ReturnType<typeof getAccounts>
}

export function AccountsTable({ accountsPromise }: AccountsTableProps) {
  // Feature flags for showcasing some additional features. Feel free to remove them.
  const { featureFlags } = useAccountsTable()

  const { data, pageCount } = React.use(accountsPromise)

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
  const filterFields: DataTableFilterField<Account>[] = [
    {
      label: "User id",
      value: "userId",
      placeholder: "Filter users by id...",
    },
    {
      label: "Account type",
      value: "accountType",
      options: accounts.accountType.enumValues.map((accountType) => ({
        label: accountType[0]?.toUpperCase() + accountType.slice(1),
        value: accountType,
        icon: getAccountTypeIcon(accountType),
        withCount: true,
      })),
    },
    {
      label: "Github id",
      value: "githubId",
      placeholder: "Filter github id...",
    },
    {
      label: "Google id",
      value: "googleId",
      placeholder: "Filter google id...",
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
          <AccountsTableFloatingBar table={table} />
        ) : null
      }
    >
      <Toolbar table={table} filterFields={filterFields}>
        <AccountsTableToolbarActions table={table} />
      </Toolbar>
    </DataTable>
  )
}
