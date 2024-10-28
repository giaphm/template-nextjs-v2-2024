import { UsersIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Group } from "~/lib/db/schema"
import { cn } from "~/lib/utils"
import { cardStyles } from "~/styles/common"
import { getGroupImageUrl } from "../groups/[groupId]/settings/util"

export function GroupCard({
  group,
  buttonText,
  memberCount,
}: {
  group: Pick<Group, "id" | "bannerId" | "name" | "description" | "id">
  buttonText: string
  memberCount: string
}) {
  return (
    <Card className={cn(cardStyles)}>
      <CardHeader>
        <Image
          src={getGroupImageUrl(group)}
          width={200}
          height={200}
          alt="image of the group"
          className="mb-2 h-[100px] w-full rounded-lg object-cover"
        />
        <CardTitle className="mb-2">{group.name}</CardTitle>
        <CardDescription className="line-clamp-4 h-20">
          {group.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2">
          <UsersIcon /> {memberCount} members
        </div>
      </CardContent>
      <CardFooter>
        <Button className="mt-auto w-full" variant="secondary" asChild>
          <Link href={`/dashboard/groups/${group.id}/info`}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
