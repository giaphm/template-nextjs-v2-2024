import { accounts } from "~/lib/db/schema"
import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
  userId: z.string().optional(),
  accountType: z.enum(accounts.accountType.enumValues).optional(),
  githubId: z.string().optional(),
  googleId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
})

export const getAccountsSchema = searchParamsSchema

export type GetAccountsSchema = z.infer<typeof getAccountsSchema>

export const createAccountSchema = z
  .object({
    userId: z.string(),
    accountType: z.enum(accounts.accountType.enumValues),
    githubId: z.string(),
    googleId: z.string(),
    password: z.string().min(1),
    passwordConfirm: z.string().min(1),
    salt: z.string().min(1),
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: "Passwords not matched",
    path: ["passwordConfirm"],
  })

export type CreateAccountSchema = z.infer<typeof createAccountSchema>

export const updateAccountSchema = z.object({
  accountType: z.enum(accounts.accountType.enumValues),
  githubId: z.string().min(1),
  googleId: z.string().min(1),
  password: z.string().min(1),
  passwordConfirm: z.string().min(1),
  salt: z.string().min(1),
})

export type UpdateAccountSchema = z.infer<typeof updateAccountSchema>
