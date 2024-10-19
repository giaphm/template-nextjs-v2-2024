import React from "react"
import { assertAuthenticated } from "~/lib/auth"
import { getGroupsByUserUseCase } from "~/lib/use-cases/groups"
import { cn } from "~/lib/utils"
import { cardStyles, pageTitleStyles } from "~/styles/common"
import Image from "next/image"
import CreateGroupButton from "./_components/create-group-button"
import Link from "next/link"
import { Search } from "lucide-react"
import { btnIconStyles, btnStyles } from "~/styles/icons"
import { Button } from "~/components/ui/button"
import { PageHeader } from "~/components/page-header"
import { GroupCard } from "./_components/group-card"

export default async function DashBoardPage() {
  const user = await assertAuthenticated()
  const groups = await getGroupsByUserUseCase(user)
  const hasGroups = groups.length > 0

  if (!hasGroups) {
    return (
      <div
        className={cn(
          "container mx-auto flex min-h-screen max-w-2xl flex-col items-center space-y-8 py-24"
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className={pageTitleStyles}>Your Groups</h1>
        </div>

        <div
          className={cn(
            cardStyles,
            "flex w-full flex-col items-center gap-6 p-12"
          )}
        >
          <Image
            src="/empty-state/no-data.svg"
            width="200"
            height="200"
            alt="no image placeholder image"
          />
          <h2>Uh-oh, you don&apos;t own any groups</h2>

          <div className="flex gap-4">
            <CreateGroupButton />

            <Button asChild className={btnStyles} variant={"secondary"}>
              <Link href={`/browse`}>
                <Search className={btnIconStyles} /> Browse Groups
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const ownedGroups = groups.filter((group) => group.userId === user.id)
  const memberGroups = groups.filter((group) => group.userId !== user.id)

  return (
    <>
      <PageHeader>
        <h1
          className={cn(
            pageTitleStyles,
            "flex flex-wrap items-center justify-between gap-4"
          )}
        >
          Your Groups
          {hasGroups && <CreateGroupButton />}
        </h1>
      </PageHeader>
      <div className={cn("container mx-auto min-h-screen space-y-8 py-12")}>
        <div className="flex items-center justify-between">
          <h2 className={"text-2xl"}>Groups You Manage</h2>
        </div>

        {ownedGroups.length === 0 && (
          <p className="mt-8 flex items-center gap-8 rounded border px-4 py-4 dark:bg-gray-800">
            You don&apos;t manage any groups
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {ownedGroups.map((group) => (
            <GroupCard
              memberCount={group.memberCount.toString()}
              group={group}
              key={group.id}
              buttonText={"Manage Group"}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 className={"text-2xl"}>Your Other Groups</h2>
        </div>

        {memberGroups.length === 0 && (
          <p
            className={cn(cardStyles, "mt-8 flex items-center gap-8 px-4 py-4")}
          >
            You&apos;re not part of any groups
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {memberGroups.map((group) => (
            <GroupCard
              memberCount={group.memberCount.toString()}
              group={group}
              key={group.id}
              buttonText={"View Group"}
            />
          ))}
        </div>
      </div>
    </>
  )
}
