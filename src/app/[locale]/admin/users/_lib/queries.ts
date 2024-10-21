import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "~/lib/db"
import { users, type User } from "~/lib/db/schema"
import { type DrizzleWhere } from "~/types"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "~/utils/filter-column"

import { type GetUsersSchema } from "./validations"

export async function getUsers(input: GetUsersSchema) {
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
    ]) as [keyof User | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined
    const toDate = input.to ? new Date(input.to) : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      input.email
        ? filterColumn({
            column: users.email,
            value: input.email,
          })
        : undefined,
      // Filter by createdAt
      fromDate ? gte(users.createdOn, fromDate) : undefined,
      toDate ? lte(users.createdOn, toDate) : undefined,
    ]
    const where: DrizzleWhere<User> =
      !input.operator || input.operator === "and"
        ? and(...expressions)
        : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(users)
        .limit(input.per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in users
            ? order === "asc"
              ? asc(users[column])
              : desc(users[column])
            : desc(users.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(users)
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

export async function getUserCountByEmailVerified() {
  noStore()
  try {
    return await db
      .select({
        status: users.emailVerified,
        count: count(),
      })
      .from(users)
      .groupBy(users.emailVerified)
      .execute()
  } catch (err) {
    return []
  }
}
