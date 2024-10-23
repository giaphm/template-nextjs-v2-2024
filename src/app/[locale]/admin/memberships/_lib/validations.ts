import { memberships } from "~/lib/db/schema"
import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  userId: z.string().optional(),
  groupId: z.string().optional(),
  role: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getMembershipsSchema = searchParamsSchema

export type GetMembershipsSchema = z.infer<typeof getMembershipsSchema>

export const createMembershipSchema = z.object({
  userId: z.number(),
  groupId: z.number(),
  role: z.enum(memberships.role.enumValues),
})

export type CreateMembershipSchema = z.infer<typeof createMembershipSchema>

export const updateMembershipSchema = z.object({
  userId: z.number().optional(),
  groupId: z.number().optional(),
  role: z.enum(memberships.role.enumValues).optional(),
})

export type UpdateMembershipSchema = z.infer<typeof updateMembershipSchema>
