import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "~/lib/db"
import { accounts, type Account } from "~/lib/db/schema"
import { type DrizzleWhere } from "~/types"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "~/utils/filter-column"

import { type GetAccountsSchema } from "./validations"

export async function getAccounts(input: GetAccountsSchema) {
  noStore()

  try {
    // Offset to paginate the results
    const offset = (input.page - 1) * input.per_page
    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (input.sort?.split(".").filter(Boolean) ?? [
      "createdAt",
      "desc",
    ]) as [keyof Account | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined
    const toDate = input.to ? new Date(input.to) : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      input.userId
        ? filterColumn({
            column: accounts.userId,
            value: input.userId,
          })
        : undefined,
      // Filter tasks by status
      !!input.accountType
        ? filterColumn({
            column: accounts.accountType,
            value: input.accountType,
            isSelectable: true,
          })
        : undefined,
      // Filter tasks by priority
      !!input.githubId
        ? filterColumn({
            column: accounts.githubId,
            value: input.githubId,
          })
        : undefined,
      // Filter tasks by priority
      !!input.googleId
        ? filterColumn({
            column: accounts.googleId,
            value: input.googleId,
          })
        : undefined,
      // Filter by createdAt
      fromDate ? gte(accounts.createdOn, fromDate) : undefined,
      toDate ? lte(accounts.createdOn, toDate) : undefined,
    ]
    const where: DrizzleWhere<Account> =
      !input.operator || input.operator === "and"
        ? and(...expressions)
        : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(accounts)
        .limit(input.per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in accounts
            ? order === "asc"
              ? asc(accounts[column])
              : desc(accounts[column])
            : desc(accounts.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(accounts)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / input.per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export async function getTaskCountByAccountType() {
  noStore()
  try {
    return await db
      .select({
        status: accounts.accountType,
        count: count(),
      })
      .from(accounts)
      .groupBy(accounts.accountType)
      .execute()
  } catch (err) {
    return []
  }
}
