import { faker } from "@faker-js/faker"
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons"
import { type Membership } from "~/lib/db/schema"

export function generateRandomMembership(
  userId?: number,
  groupId?: number
): Membership {
  return {
    id: faker.number.int({ max: 10000 }),
    userId: userId ?? faker.number.int({ max: 10000 }),
    groupId: groupId ?? faker.number.int({ max: 10000 }),
    role: "member",
    createdOn: new Date(),
    updatedOn: new Date(),
  }
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param role - The role of the membership.
 * @returns A React component representing the role icon.
 */
export function getRoleIcon(role: Membership["role"]) {
  const roleIcons = {
    member: CrossCircledIcon,
    admin: CheckCircledIcon,
  }

  return roleIcons[role] || CircleIcon
}
