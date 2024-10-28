import { saveNewsletterSubscription } from "~/lib/data-access/newsletters"
import { subscribeEmail } from "~/lib/newsletter/newsletter"

export async function subscribeEmailUseCase(email: string) {
  await Promise.all([saveNewsletterSubscription(email), subscribeEmail(email)])
}
