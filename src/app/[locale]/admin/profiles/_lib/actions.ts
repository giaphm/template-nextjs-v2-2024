"use server"

import { count, eq, inArray } from "drizzle-orm"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "~/lib/db/index"
import { NewProfile, profiles, type Profile } from "~/lib/db/schema"
import { takeFirstOrThrow } from "~/lib/db/utils"

import { getErrorMessage } from "~/utils/handle-errors"

import { generateRandomProfile } from "./utils"
import type { CreateProfileSchema, UpdateProfileSchema } from "./validations"

export async function seedProfiles(input: { count: number }) {
  const count = input.count ?? 100

  try {
    const allProfiles: NewProfile[] = []

    for (let i = 0; i < count; i++) {
      allProfiles.push(generateRandomProfile())
    }

    await db.delete(profiles)

    console.log("📝 Inserting profiles", allProfiles.length)

    await db.insert(profiles).values(allProfiles).onConflictDoNothing()
  } catch (err) {
    console.error(err)
  }
}

export async function createProfile(input: CreateProfileSchema) {
  noStore()
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(profiles)
        .values({
          userId: input.userId,
          displayName: input.displayName,
          imageId: input.imageId,
          image: input.image,
          bio: input.bio,
        })
        .returning({
          id: profiles.id,
        })
        .then(takeFirstOrThrow)

      // Delete a task to keep the total number of tasks constant
      // await tx.delete(profiles).where(
      //   eq(
      //     profiles.id,
      //     (
      //       await tx
      //         .select({
      //           id: profiles.id,
      //         })
      //         .from(profiles)
      //         .limit(1)
      //         .where(not(eq(profiles.id, newTask.id)))
      //         .orderBy(asc(profiles.createdOn))
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

export async function updateProfile(
  input: UpdateProfileSchema & { id: number }
) {
  noStore()
  try {
    await db
      .update(profiles)
      .set({
        userId: input.userId,
        displayName: input.displayName,
        imageId: input.imageId,
        image: input.image,
        bio: input.bio,
      })
      .where(eq(profiles.id, input.id))

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

export async function updateProfiles(input: {
  ids: number[]
  bio?: Profile["bio"]
}) {
  noStore()
  try {
    await db
      .update(profiles)
      .set({
        bio: input.bio,
      })
      .where(inArray(profiles.id, input.ids))

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

export async function deleteProfile(input: { id: number }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(profiles).where(eq(profiles.id, input.id))

      // Create a new task for the deleted one
      await tx.insert(profiles).values(generateRandomProfile())
    })

    revalidatePath("/")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteProfiles(input: { ids: number[] }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(profiles).where(inArray(profiles.id, input.ids))

      // Create new tasks for the deleted ones
      await tx
        .insert(profiles)
        .values(input.ids.map(() => generateRandomProfile()))
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

export async function getChunkedProfiles(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalProfiles = await db
      .select({
        count: count(),
      })
      .from(profiles)
      .then(takeFirstOrThrow)

    const totalChunks = Math.ceil(totalProfiles.count / chunkSize)

    let chunkedProfiles

    for (let i = 0; i < totalChunks; i++) {
      chunkedProfiles = await db
        .select()
        .from(profiles)
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
      data: chunkedProfiles,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
