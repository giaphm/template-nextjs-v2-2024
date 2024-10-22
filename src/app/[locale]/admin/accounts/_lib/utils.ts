import { faker } from "@faker-js/faker"
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons"
import crypto from "crypto"
import { type Account, NewAccount, NewUser } from "~/lib/db/schema"

import { generateId } from "~/utils/id"

export function generateRandomUser(): NewUser {
  return {
    email: faker.internet.email(),
    emailVerified: Math.random() < 0.5 ? null : new Date(),
    createdOn: new Date(),
    updatedOn: new Date(),
  }
}

export function generateRandomAccount(userId?: number): NewAccount {
  return {
    userId: userId ?? faker.number.int({ max: 10000 }),
    accountType: "email",
    githubId: generateId(),
    googleId: generateId(),
    password: "",
    salt: crypto.randomBytes(128).toString("base64"),
    createdOn: new Date(),
    updatedOn: new Date(),
  }
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the task.
 * @returns A React component representing the status icon.
 */
export function getAccountTypeIcon(accountType: Account["accountType"]) {
  const accountTypeIcons = {
    email: CrossCircledIcon,
    github: CheckCircledIcon,
    google: QuestionMarkCircledIcon,
  }

  return accountTypeIcons[accountType] || CircleIcon
}
