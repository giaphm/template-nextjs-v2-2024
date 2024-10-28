import { EditGroupInfoForm } from "./edit-group-info-form"
import { getCurrentUser } from "~/lib/auth/auth"
import {
  getPublicGroupInfoByIdUseCase,
  isAdminOrOwnerOfGroupUseCase,
} from "~/lib/use-cases/groups"
import { getGroupImageUrl } from "../settings/util"
import Image from "next/image"
import { DiscordIcon, GithubIcon, XIcon, YoutubeIcon } from "~/components/icons"
import Link from "next/link"
import { socialIconStyles } from "~/styles/icons"
import { cardStyles, pageTitleStyles } from "~/styles/common"
import { cn } from "~/lib/utils"
import { NotFoundError } from "~/app/util"

export default async function InfoPage({
  params,
}: {
  params: { groupId: string }
}) {
  const { groupId } = params

  const user = await getCurrentUser()

  const isAdminOrOwner = await isAdminOrOwnerOfGroupUseCase(
    user,
    parseInt(groupId)
  )

  const group = await getPublicGroupInfoByIdUseCase(parseInt(groupId))

  if (!group) {
    throw new NotFoundError("Group not found")
  }

  return (
    <div className="space-y-8">
      <h1 className={cn(pageTitleStyles, "flex items-center justify-between")}>
        <div>Info</div>
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div
          className={cn(
            cardStyles,
            "order-first w-full flex-shrink-0 space-y-8 p-4 lg:order-last lg:w-[300px] lg:p-8"
          )}
        >
          <Image
            src={getGroupImageUrl(group)}
            width={300}
            height={200}
            alt="image of the group"
            className="mb-8 max-h-[100px] w-full rounded-lg object-cover md:max-h-[150px]"
          />

          <div className="break-words">{group.description}</div>

          <div className="flex justify-center gap-6">
            {group.githubLink && (
              <Link
                href={group.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <GithubIcon className={socialIconStyles} />
              </Link>
            )}
            {group.youtubeLink && (
              <Link
                href={group.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <YoutubeIcon className={socialIconStyles} />
              </Link>
            )}
            {group.discordLink && (
              <Link
                href={group.discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <DiscordIcon className={socialIconStyles} />
              </Link>
            )}
            {group.xLink && (
              <Link
                href={group.xLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <XIcon className={socialIconStyles} />
              </Link>
            )}
          </div>
        </div>

        <div className="w-full flex-grow lg:w-auto">
          <EditGroupInfoForm
            isAdminOrOwner={isAdminOrOwner}
            groupId={group.id}
            info={group.info ?? ""}
          />
        </div>
      </div>
    </div>
  )
}
