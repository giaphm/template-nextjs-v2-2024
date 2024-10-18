import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { getUserProfileUseCase } from '~/lib/use-cases/users'
import { getProfileImageFullUrl } from '~/utils/profiles'

export async function ProfileAvatar({ userId }: { userId: number }) {
  const profile = await getUserProfileUseCase(userId)

  return (
    <Avatar>
      <AvatarImage src={getProfileImageFullUrl(profile)} />
      <AvatarFallback>
        {profile.displayName?.substring(0, 2).toUpperCase() ?? 'AA'}
      </AvatarFallback>
    </Avatar>
  )
}
