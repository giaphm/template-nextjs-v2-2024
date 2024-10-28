import { db, subscriptions } from "~/lib/db"
import { UserId } from "~/lib/use-cases/types"
import { eq } from "drizzle-orm"

export async function createSubscription(subscription: {
  userId: UserId
  stripeSubscriptionId: string
  stripeCustomerId: string
  stripePriceId: string
  stripeCurrentPeriodEnd: Date
}) {
  await db.insert(subscriptions).values(subscription)
}

export async function updateSubscription(subscription: {
  stripeSubscriptionId: string
  stripePriceId: string
  stripeCurrentPeriodEnd: Date
}) {
  await db
    .update(subscriptions)
    .set({
      stripePriceId: subscription.stripePriceId,
      stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
    })
    .where(
      eq(subscriptions.stripeSubscriptionId, subscription.stripeSubscriptionId)
    )
}

export async function getSubscription(userId: UserId) {
  return await db.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => eq(subscriptions.userId, userId),
  })
}
