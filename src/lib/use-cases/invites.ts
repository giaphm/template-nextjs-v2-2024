import {
  createInvite,
  deleteInvite,
  getInvite,
} from "~/lib/data-access/invites"
import { addMembership } from "~/lib/data-access/memberships"
import { GroupId } from "~/lib/db/schema"
import { sendEmail } from "~/lib/email/sendEmail"
import {
  assertAdminOrOwnerOfGroup,
  assertGroupExists,
} from "~/lib/use-cases/authorization"
import { UserSession } from "~/lib/use-cases/types"
import { PublicError } from "~/lib/use-cases/errors"
import { InviteEmail } from "~/components/invite-email"

export async function sendInviteUseCase(
  authenticatedUser: UserSession,
  { email, groupId }: { email: string; groupId: GroupId }
) {
  await assertAdminOrOwnerOfGroup(authenticatedUser, groupId)
  const group = await assertGroupExists(groupId)
  const invite = await createInvite(groupId)
  await sendEmail(
    email,
    "You have been invited to join a group",
    InviteEmail({ group: group, token: invite.token })
  )
}

export async function acceptInviteUseCase(
  authenticatedUser: UserSession,
  { token }: { token: string }
) {
  const invite = await getInvite(token)

  if (!invite) {
    throw new PublicError("This invite does not exist or has expired")
  }

  if (invite.tokenExpiresAt && invite.tokenExpiresAt < new Date()) {
    throw new PublicError("This invite has expired")
  }

  await addMembership(authenticatedUser.id, invite.groupId)
  await deleteInvite(token)

  return invite.groupId
}
