import { and, eq } from "drizzle-orm"
import { UserId } from "../use-cases/types"
import { db, memberships } from "../db"

export async function getMembership(userId: UserId, groupId: number) {
  return await db.query.memberships.findFirst({
    where: and(
      eq(memberships.userId, userId),
      eq(memberships.groupId, groupId)
    ),
  })
}
