"use server"

import { asc, count, eq, inArray, not } from "drizzle-orm"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "~/lib/db"
import { groups, NewGroup, type Group } from "~/lib/db/schema"
import { takeFirstOrThrow } from "~/lib/db/utils"

import { getErrorMessage } from "~/utils/handle-errors"

import { generateRandomGroup } from "./utils"
import type { CreateGroupSchema, UpdateGroupSchema } from "./validations"

export async function seedGroups(input: { count: number }) {
  const count = input.count ?? 100

  try {
    const allGroups: NewGroup[] = []

    for (let i = 0; i < count; i++) {
      allGroups.push(generateRandomGroup())
    }

    await db.delete(groups)

    console.log("📝 Inserting groups", allGroups.length)

    await db.insert(groups).values(allGroups).onConflictDoNothing()
  } catch (err) {
    console.error(err)
  }
}

export async function createGroup(input: CreateGroupSchema) {
  noStore()
  try {
    await db.transaction(async (tx) => {
      const newGroup = await tx
        .insert(groups)
        .values({
          name: input.name,
          userId: Number(input.userId),
          description: input.description,
          isPublic: input.isPublic,
          bannerId: input.bannerId,
          info: input.info,
          youtubeLink: input.youtubeLink,
          discordLink: input.discordLink,
          githubLink: input.githubLink,
        })
        .returning({
          id: groups.id,
        })
        .then(takeFirstOrThrow)

      // Delete a group to keep the total number of groups constant
      await tx.delete(groups).where(
        eq(
          groups.id,
          (
            await tx
              .select({
                id: groups.id,
              })
              .from(groups)
              .limit(1)
              .where(not(eq(groups.id, newGroup.id)))
              .orderBy(asc(groups.createdOn))
              .then(takeFirstOrThrow)
          ).id
        )
      )
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

export async function updateGroup(input: UpdateGroupSchema & { id: number }) {
  noStore()
  try {
    await db
      .update(groups)
      .set({
        name: input.name,
        userId: Number(input.userId),
        description: input.description,
        isPublic: input.isPublic,
        bannerId: input.bannerId,
        info: input.info,
        youtubeLink: input.youtubeLink,
        discordLink: input.discordLink,
        githubLink: input.githubLink,
      })
      .where(eq(groups.id, input.id))

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

export async function updateGroups(input: {
  ids: number[]
  isPublic?: Group["isPublic"]
}) {
  noStore()
  try {
    await db
      .update(groups)
      .set({
        isPublic: input.isPublic,
      })
      .where(inArray(groups.id, input.ids))

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

export async function deleteGroup(input: { id: number }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(groups).where(eq(groups.id, input.id))

      // Create a new task for the deleted one
      await tx.insert(groups).values(generateRandomGroup())
    })

    revalidatePath("/")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteGroups(input: { ids: number[] }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(groups).where(inArray(groups.id, input.ids))

      // Create new groups for the deleted ones
      await tx.insert(groups).values(input.ids.map(() => generateRandomGroup()))
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

export async function getChunkedGroups(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalGroups = await db
      .select({
        count: count(),
      })
      .from(groups)
      .then(takeFirstOrThrow)

    const totalChunks = Math.ceil(totalGroups.count / chunkSize)

    let chunkedGroups

    for (let i = 0; i < totalChunks; i++) {
      chunkedGroups = await db
        .select()
        .from(groups)
        .limit(chunkSize)
        .offset(i * chunkSize)
        .then((groups) =>
          groups.map((groups) => ({
            ...groups,
            createdAt: groups.createdOn.toString(),
            updatedAt: groups.updatedOn?.toString(),
          }))
        )
    }

    return {
      data: chunkedGroups,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
