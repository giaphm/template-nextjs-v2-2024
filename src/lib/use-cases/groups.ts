import { MAX_GROUP_PREMIUM_LIMIT, MAX_GROUP_LIMIT } from "~/app-config"
import {
  countUserGroups,
  createGroup,
  getGroupsByMembership,
  getGroupsByUser,
} from "../data-access/groups"
import { getSubscription } from "../data-access/subscriptions"
import { PublicError } from "./errors"
import { getSubscriptionPlan } from "./subscriptions"
import { UserSession } from "./types"

export async function getGroupsByUserUseCase(authenticatedUser: UserSession) {
  return [
    ...(await getGroupsByUser(authenticatedUser.id)),
    ...(await getGroupsByMembership(authenticatedUser.id)),
  ]
}

export async function createGroupUseCase(
  authenticatedUser: UserSession,
  newGroup: { name: string; description: string }
) {
  const numberOfGroups = await countUserGroups(authenticatedUser.id)

  const subscription = await getSubscription(authenticatedUser.id)
  const plan = getSubscriptionPlan(subscription)

  if (
    numberOfGroups >=
    (plan === "premium" ? MAX_GROUP_PREMIUM_LIMIT : MAX_GROUP_LIMIT)
  ) {
    throw new PublicError(
      "Your account have reached the maximum number of groups"
    )
  }

  await createGroup({ ...newGroup, userId: authenticatedUser.id })
}
