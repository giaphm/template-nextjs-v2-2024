import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { getCurrentUser } from "~/lib/auth/auth"
import { cn } from "~/lib/utils"
import { cardStyles, pageTitleStyles } from "~/styles/common"
import { getGroupMembersUseCase } from "~/lib/use-cases/groups"
import { isGroupOwnerUseCase } from "~/lib/use-cases/memberships"
import { Role, UserId } from "~/lib/use-cases/types"
import Link from "next/link"
import { InviteButton } from "../invite-button"
import { Crown, Gavel, Users } from "lucide-react"
import { MemberCardActions } from "./member-card-actions"
import { GroupId } from "~/lib/db/schema"

function MemberCard({
  showActions,
  member,
  groupId,
}: {
  showActions?: boolean
  groupId: GroupId
  member: {
    userId: UserId
    image: string | null
    name: string | null
    role: Role
  }
}) {
  return (
    <div key={member.userId} className="flex items-center gap-4">
      <div
        className={cn(
          cardStyles,
          "flex items-center gap-4 p-4 hover:underline"
        )}
      >
        <Avatar>
          <AvatarImage src={member.image || "/group.jpeg"} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Link href={`/users/${member.userId}/info`}>
          <p className="text-xl">{member.name}</p>
        </Link>
        {showActions && (
          <MemberCardActions
            userRole={member.role}
            groupId={groupId}
            userId={member.userId}
          />
        )}
      </div>
    </div>
  )
}

export default async function MembersPage({
  params,
}: {
  params: { groupId: string }
}) {
  const user = await getCurrentUser()
  const groupId = parseInt(params.groupId)
  const members = await getGroupMembersUseCase(user, groupId)

  const owners = members.filter((member) => member.role === "owner")
  const admins = members.filter((member) => member.role === "admin")
  const regularMembers = members.filter((member) => member.role === "member")

  const isGroupOwner = !user ? false : await isGroupOwnerUseCase(user, groupId)

  return (
    <div className="space-y-8">
      <h1 className={cn(pageTitleStyles, "flex items-center justify-between")}>
        <div>Members</div>
        {isGroupOwner && <InviteButton />}
      </h1>

      <h2 className="flex items-center gap-2 text-2xl">
        <Crown /> Owner
      </h2>
      <div className="flex flex-wrap gap-4">
        {owners.map((member) => (
          <MemberCard
            showActions={false}
            groupId={groupId}
            key={member.userId}
            member={member}
          />
        ))}
      </div>

      {admins.length > 0 && (
        <>
          <h2 className="flex items-center gap-2 text-2xl">
            <Gavel /> Admin
          </h2>
          <div className="flex flex-wrap gap-4">
            {admins.map((member) => (
              <MemberCard
                groupId={groupId}
                showActions={isGroupOwner}
                key={member.userId}
                member={member}
              />
            ))}
          </div>
        </>
      )}

      {regularMembers.length > 0 && (
        <>
          <h2 className="flex items-center gap-2 text-2xl">
            <Users /> Members
          </h2>
          <div className="flex flex-wrap gap-4">
            {regularMembers.map((member) => (
              <MemberCard
                groupId={groupId}
                showActions={isGroupOwner}
                key={member.userId}
                member={member}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
