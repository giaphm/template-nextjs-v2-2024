import { GroupCard } from "~/app/[locale]/dashboard/_components/group-card"
import { getPublicGroupsByUserIdUseCase } from "~/lib/use-cases/groups"
import Image from "next/image"

export default async function GroupsContent({
  params,
}: {
  params: { userId: string }
}) {
  const { userId } = params
  const userGroups = await getPublicGroupsByUserIdUseCase(parseInt(userId))

  return (
    <div className="space-y-8">
      {userGroups.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-8 rounded-xl py-12 dark:bg-slate-900">
          <Image
            src="/empty-state/mountain.svg"
            width="200"
            height="200"
            alt="no groups placeholder image"
            className="h-auto w-full max-w-[200px]"
          />
          <h2 className="px-4 text-center text-2xl">
            This user isn&apos;t part of any groups
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {userGroups.map((group) => (
          <GroupCard
            memberCount={group.memberCount.toString()}
            group={group}
            key={group.id}
            buttonText="View Group"
          />
        ))}
      </div>
    </div>
  )
}
