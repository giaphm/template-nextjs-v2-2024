import { db } from "~/lib/db"
import { NewReply, Reply, replies } from "~/lib/db/schema"
import { count, eq } from "drizzle-orm"

export async function getReplyCountOnPost(postId: number) {
  const [{ count: total }] = await db
    .select({ count: count() })
    .from(replies)
    .where(eq(replies.postId, postId))
  return total
}

export async function getRepliesOnPost(postId: number) {
  const posts = await db.query.replies.findMany({
    where: eq(replies.postId, postId),
  })
  return posts
}

export async function createReply(newReply: NewReply) {
  const [createdReply] = await db.insert(replies).values(newReply).returning()
  return createdReply
}

export async function getReplyById(repliesId: number) {
  return await db.query.replies.findFirst({
    where: eq(replies.id, repliesId),
  })
}

export async function deleteReply(repliesId: number) {
  await db.delete(replies).where(eq(replies.id, repliesId))
}

export async function updateReply(
  repliesId: number,
  updatedRelpy: Partial<Reply>
) {
  const [updatedReply] = await db
    .update(replies)
    .set(updatedRelpy)
    .where(eq(replies.id, repliesId))
    .returning()

  return updatedReply
}
