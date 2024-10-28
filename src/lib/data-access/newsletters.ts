import { db, newsletters } from "~/lib/db"

export async function saveNewsletterSubscription(email: string) {
  await db
    .insert(newsletters)
    .values({
      email,
    })
    .onConflictDoNothing() // we need onConflictDoNothing because if the same person tries to subscribe twice, we shouldn't crash for them
}
