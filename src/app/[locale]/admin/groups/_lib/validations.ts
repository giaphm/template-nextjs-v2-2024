import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getGroupsSchema = searchParamsSchema

export type GetGroupsSchema = z.infer<typeof getGroupsSchema>

export const createGroupSchema = z.object({
  userId: z.string(),
  name: z.string(),
  description: z.string(),
  isPublic: z.boolean().default(false),
  bannerId: z.string(),
  info: z.string(),
  youtubeLink: z.string(),
  discordLink: z.string(),
  githubLink: z.string(),
  xLink: z.string(),
})

export type CreateGroupSchema = z.infer<typeof createGroupSchema>

export const updateGroupSchema = z.object({
  userId: z.number().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  bannerId: z.string().optional(),
  info: z.string().optional(),
  youtubeLink: z.string().optional(),
  discordLink: z.string().optional(),
  githubLink: z.string().optional(),
  xLink: z.string().optional(),
})

export type UpdateGroupSchema = z.infer<typeof updateGroupSchema>
