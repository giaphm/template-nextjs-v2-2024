import { eq } from "drizzle-orm"
import { db, Profile, profiles } from "../db"
import { UserId } from "../use-cases/types"

export async function createProfile(
  userId: number,
  displayName: string,
  image?: string
) {
  const [newProfile] = await db
    .insert(profiles)
    .values({
      userId,
      image,
      displayName,
    })
    .onConflictDoNothing()
    .returning()

  return newProfile
}

export async function getProfile(userId: UserId) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  })

  return profile
}

export async function updateProfile(
  userId: UserId,
  updateProfile: Partial<Profile>
) {
  await db
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId))
}
