import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "~/lib/db"
import { memberships, type Membership } from "~/lib/db/schema"
import { type DrizzleWhere } from "~/types"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "~/utils/filter-column"

import { type GetMembershipsSchema } from "./validations"

export async function getMemberships(input: GetMembershipsSchema) {
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
    ]) as [keyof Membership | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined
    const toDate = input.to ? new Date(input.to) : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      input.userId
        ? filterColumn({
            column: memberships.userId,
            value: input.userId,
          })
        : undefined,
      // Filter memberships by group id
      !!input.groupId
        ? filterColumn({
            column: memberships.groupId,
            value: input.groupId,
            isSelectable: true,
          })
        : undefined,
      // Filter memberships by role
      !!input.role
        ? filterColumn({
            column: memberships.role,
            value: input.role,
            isSelectable: true,
          })
        : undefined,
      // Filter by createdAt
      fromDate ? gte(memberships.createdOn, fromDate) : undefined,
      toDate ? lte(memberships.createdOn, toDate) : undefined,
    ]
    const where: DrizzleWhere<Membership> =
      !input.operator || input.operator === "and"
        ? and(...expressions)
        : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(memberships)
        .limit(input.per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in memberships
            ? order === "asc"
              ? asc(memberships[column])
              : desc(memberships[column])
            : desc(memberships.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(memberships)
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

export async function getMembershipCountByUserId() {
  noStore()
  try {
    return await db
      .select({
        status: memberships.userId,
        count: count(),
      })
      .from(memberships)
      .groupBy(memberships.userId)
      .execute()
  } catch (err) {
    return []
  }
}

export async function getMembershipCountByRole() {
  noStore()
  try {
    return await db
      .select({
        role: memberships.role,
        count: count(),
      })
      .from(memberships)
      .groupBy(memberships.role)
      .execute()
  } catch (err) {
    return []
  }
}
