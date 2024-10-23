import "server-only"

import { unstable_noStore as noStore } from "next/cache"
import { db } from "~/lib/db"
import { profiles, type Profile } from "~/lib/db/schema"
import { type DrizzleWhere } from "~/types"
import { and, asc, count, desc, gte, lte, or, type SQL } from "drizzle-orm"

import { filterColumn } from "~/utils/filter-column"

import { type GetProfilesSchema } from "./validations"

export async function getProfiles(input: GetProfilesSchema) {
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
    ]) as [keyof Profile | undefined, "asc" | "desc" | undefined]

    // Convert the date strings to date objects
    const fromDate = input.from ? new Date(input.from) : undefined
    const toDate = input.to ? new Date(input.to) : undefined

    const expressions: (SQL<unknown> | undefined)[] = [
      input.userId
        ? filterColumn({
            column: profiles.userId,
            value: input.userId,
          })
        : undefined,
      // Filter profiles by status
      !!input.displayName
        ? filterColumn({
            column: profiles.displayName,
            value: input.displayName,
            isSelectable: true,
          })
        : undefined,
      // Filter profiles by priority
      !!input.bio
        ? filterColumn({
            column: profiles.bio,
            value: input.bio,
            isSelectable: true,
          })
        : undefined,
      // Filter by createdOn
      fromDate ? gte(profiles.createdOn, fromDate) : undefined,
      toDate ? lte(profiles.createdOn, toDate) : undefined,
    ]
    const where: DrizzleWhere<Profile> =
      !input.operator || input.operator === "and"
        ? and(...expressions)
        : or(...expressions)

    // Transaction is used to ensure both queries are executed in a single transaction
    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(profiles)
        .limit(input.per_page)
        .offset(offset)
        .where(where)
        .orderBy(
          column && column in profiles
            ? order === "asc"
              ? asc(profiles[column])
              : desc(profiles[column])
            : desc(profiles.id)
        )

      const total = await tx
        .select({
          count: count(),
        })
        .from(profiles)
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
