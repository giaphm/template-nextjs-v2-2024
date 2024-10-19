import { z } from "zod"

export const createGroupFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

export type CreateGroupFormType = z.infer<typeof createGroupFormSchema>
