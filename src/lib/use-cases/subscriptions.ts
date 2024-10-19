import env from "~/env"
import { Subscription } from "../db"

export function getSubscriptionPlan(subscription?: Subscription) {
  if (!subscription) {
    return "free"
  } else {
    return subscription.stripePriceId === env.NEXT_PUBLIC_PRICE_ID_PREMIUM
      ? "premium"
      : "basic"
  }
}
