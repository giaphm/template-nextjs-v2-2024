import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "~/lib/db"
import { groups, type Group } from "~/lib/db/schema"
import { type DrizzleWhere } from "~/types"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "~/utils/filter-column"

import { type GetGroupsSchema } from "./validations"

export async function getGroups(input: GetGroupsSchema) {
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
    ]) as [keyof Group | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined
    const toDate = input.to ? new Date(input.to) : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      input.name
        ? filterColumn({
            column: groups.name,
            value: input.name,
          })
        : undefined,
      // Filter groups by description
      !!input.description
        ? filterColumn({
            column: groups.description,
            value: input.description,
          })
        : undefined,
      // Filter groups by isPublic
      !!input.isPublic
        ? filterColumn({
            column: groups.isPublic,
            value: input.isPublic,
            isSelectable: true,
          })
        : undefined,
      // Filter by createdAt
      fromDate ? gte(groups.createdOn, fromDate) : undefined,
      toDate ? lte(groups.createdOn, toDate) : undefined,
    ]
    const where: DrizzleWhere<Group> =
      !input.operator || input.operator === "and"
        ? and(...expressions)
        : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(groups)
        .limit(input.per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in groups
            ? order === "asc"
              ? asc(groups[column])
              : desc(groups[column])
            : desc(groups.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(groups)
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

export async function getGroupCountByIsPublic() {
  noStore()
  try {
    return await db
      .select({
        status: groups.isPublic,
        count: count(),
      })
      .from(groups)
      .groupBy(groups.isPublic)
      .execute()
  } catch (err) {
    return []
  }
}
