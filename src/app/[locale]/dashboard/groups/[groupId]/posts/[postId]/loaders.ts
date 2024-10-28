import { getUserProfileUseCase } from "~/lib/use-cases/users"
import { cache } from "react"

export const getUserProfileLoader = cache(getUserProfileUseCase)
