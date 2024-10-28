import { useSafeParams } from "~/utils/params"
import { z } from "zod"

export function useGroupIdParam() {
  const { groupId } = useSafeParams(
    z.object({ groupId: z.string().pipe(z.coerce.number()) })
  )
  return groupId
}
