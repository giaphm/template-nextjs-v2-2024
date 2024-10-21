import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  email: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getUsersSchema = searchParamsSchema

export type GetUsersSchema = z.infer<typeof getUsersSchema>

export const createUserSchema = z.object({
  email: z.string(),
  emailVerified: z.date(),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  email: z.string().optional(),
  emailVerified: z.date().optional(),
})

export type UpdateUserSchema = z.infer<typeof updateUserSchema>
