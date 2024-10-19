import { db } from "../db"
import { UserId } from "../use-cases/types"

export async function getSubscription(userId: UserId) {
  return db.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => eq(subscriptions.userId, userId),
  })
}
