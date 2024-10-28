import { TOKEN_TTL } from "~/app-config"
import { db } from "~/lib/db"
import { GroupId, invites } from "~/lib/db/schema"
import { eq } from "drizzle-orm"

export async function getInvite(token: string) {
  return await db.query.invites.findFirst({
    where: eq(invites.token, token),
  })
}

export async function deleteInvite(token: string) {
  await db.delete(invites).where(eq(invites.token, token))
}

export async function createInvite(groupId: GroupId) {
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL)

  const [invite] = await db
    .insert(invites)
    .values({
      groupId,
      tokenExpiresAt,
    })
    .returning()
  return invite
}
