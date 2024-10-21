import { faker } from "@faker-js/faker"
import { CheckCircledIcon, CircleIcon } from "@radix-ui/react-icons"
import { NewUser } from "~/lib/db"

export function generateRandomUser(): NewUser {
  return {
    email: faker.internet.email(),
    emailVerified: Math.random() < 0.5 ? null : new Date(),
    createdOn: new Date(),
    updatedOn: new Date(),
  }
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getEmailVerifiedIcon(isEmailVerified: boolean) {
  return isEmailVerified ? CheckCircledIcon : CircleIcon
}
