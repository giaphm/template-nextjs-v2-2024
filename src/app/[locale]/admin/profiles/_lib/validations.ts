import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  userId: z.string().optional(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getProfilesSchema = searchParamsSchema

export type GetProfilesSchema = z.infer<typeof getProfilesSchema>

export const createProfileSchema = z.object({
  userId: z.number(),
  displayName: z.string(),
  imageId: z.string(),
  image: z.string(),
  bio: z.string(),
})

export type CreateProfileSchema = z.infer<typeof createProfileSchema>

export const updateProfileSchema = z.object({
  userId: z.number().optional(),
  displayName: z.string().optional(),
  imageId: z.string().optional(),
  image: z.string().optional(),
  bio: z.string().optional(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
