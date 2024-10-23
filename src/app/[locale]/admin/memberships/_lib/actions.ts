"use server"

import { count, eq, inArray } from "drizzle-orm"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "~/lib/db/index"
import { memberships, type Membership } from "~/lib/db/schema"
import { takeFirstOrThrow } from "~/lib/db/utils"

import { getErrorMessage } from "~/utils/handle-errors"

import { generateRandomMembership } from "./utils"
import type {
  CreateMembershipSchema,
  UpdateMembershipSchema,
} from "./validations"

export async function seedMemberships(input: { count: number }) {
  const count = input.count ?? 100

  try {
    const allMemberships: Membership[] = []

    for (let i = 0; i < count; i++) {
      allMemberships.push(generateRandomMembership())
    }

    await db.delete(memberships)

    console.log("📝 Inserting memberships", allMemberships.length)

    await db.insert(memberships).values(allMemberships).onConflictDoNothing()
  } catch (err) {
    console.error(err)
  }
}

export async function createMembership(input: CreateMembershipSchema) {
  noStore()
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(memberships)
        .values({
          userId: input.userId,
          groupId: input.groupId,
          role: input.role,
        })
        .returning({
          id: memberships.id,
        })
        .then(takeFirstOrThrow)

      // Delete a task to keep the total number of tasks constant
      // await tx.delete(memberships).where(
      //   eq(
      //     memberships.id,
      //     (
      //       await tx
      //         .select({
      //           id: memberships.id,
      //         })
      //         .from(memberships)
      //         .limit(1)
      //         .where(not(eq(memberships.id, newTask.id)))
      //         .orderBy(asc(memberships.createdOn))
      //         .then(takeFirstOrThrow)
      //     ).id
      //   )
      // )
    })

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateMembership(
  input: UpdateMembershipSchema & { id: number }
) {
  noStore()
  try {
    await db
      .update(memberships)
      .set({
        userId: input.userId,
        groupId: input.groupId,
        role: input.role,
      })
      .where(eq(memberships.id, input.id))

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateMemberships(input: {
  ids: number[]
  userId?: Membership["userId"]
  groupId?: Membership["groupId"]
  role?: Membership["role"]
}) {
  noStore()
  try {
    await db
      .update(memberships)
      .set({
        userId: input.userId,
        groupId: input.groupId,
        role: input.role,
      })
      .where(inArray(memberships.id, input.ids))

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteMembership(input: { id: number }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(memberships).where(eq(memberships.id, input.id))

      // Create a new task for the deleted one
      await tx.insert(memberships).values(generateRandomMembership())
    })

    revalidatePath("/")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteMemberships(input: { ids: number[] }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(memberships).where(inArray(memberships.id, input.ids))

      // Create new memberships for the deleted ones
      await tx
        .insert(memberships)
        .values(input.ids.map(() => generateRandomMembership()))
    })

    revalidatePath("/")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function getChunkedMemberships(
  input: { chunkSize?: number } = {}
) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalMemberships = await db
      .select({
        count: count(),
      })
      .from(memberships)
      .then(takeFirstOrThrow)

    const totalChunks = Math.ceil(totalMemberships.count / chunkSize)

    let chunkedMemberships

    for (let i = 0; i < totalChunks; i++) {
      chunkedMemberships = await db
        .select()
        .from(memberships)
        .limit(chunkSize)
        .offset(i * chunkSize)
        .then((tasks) =>
          tasks.map((task) => ({
            ...task,
            createdAt: task.createdOn.toString(),
            updatedAt: task.updatedOn?.toString(),
          }))
        )
    }

    return {
      data: chunkedMemberships,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
