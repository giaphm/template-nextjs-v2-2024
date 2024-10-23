import { faker } from "@faker-js/faker"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { NewGroup, type Group } from "~/lib/db/schema"

export function generateRandomGroup(userId?: number): NewGroup {
  return {
    userId: userId ?? faker.number.int({ max: 10000 }),
    name: faker.internet.displayName(),
    description: "",
    createdOn: new Date(),
    updatedOn: new Date(),
  }
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getIsPublicIcon(isPublic: Group["isPublic"]) {
  return isPublic ? CheckCircledIcon : CrossCircledIcon
}
