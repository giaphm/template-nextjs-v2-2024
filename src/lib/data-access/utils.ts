import { db } from '../db'

export async function createTransaction<T extends typeof db>(
  cb: (trx: T) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.transaction(cb as any)
}
