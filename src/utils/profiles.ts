import { Profile } from '~/lib/db'
import { getProfileImageUrl } from '~/lib/use-cases/users'

export function getProfileImageFullUrl(profile: Profile) {
  if (profile.imageId) {
    return getProfileImageUrl(profile.userId, profile.imageId)
  }

  return profile.image ? profile.image : '/profile.jpeg'
}
