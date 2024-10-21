"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "~/lib/db"
import { users, type User, NewUser } from "~/lib/db/schema"
import { takeFirstOrThrow } from "~/lib/db/utils"
import { asc, count, eq, inArray, not } from "drizzle-orm"

import { getErrorMessage } from "~/utils/handle-errors"

import { generateRandomUser } from "./utils"
import type { CreateUserSchema, UpdateUserSchema } from "./validations"

export async function seedUsers(input: { count: number }) {
  const count = input.count ?? 100

  try {
    const allUsers: NewUser[] = []

    for (let i = 0; i < count; i++) {
      allUsers.push(generateRandomUser())
    }

    await db.delete(users)

    console.log("📝 Inserting users", allUsers.length)

    await db.insert(users).values(allUsers).onConflictDoNothing()
  } catch (err) {
    console.error(err)
  }
}

export async function createUser(input: CreateUserSchema) {
  noStore()
  try {
    await db.transaction(async (tx) => {
      const newUser = await tx
        .insert(users)
        .values({
          email: input.email,
          emailVerified: input.emailVerified,
        })
        .returning({
          id: users.id,
        })
        .then(takeFirstOrThrow)

      // Delete a user to keep the total number of users constant
      await tx.delete(users).where(
        eq(
          users.id,
          (
            await tx
              .select({
                id: users.id,
              })
              .from(users)
              .limit(1)
              .where(not(eq(users.id, newUser.id)))
              .orderBy(asc(users.createdOn))
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

export async function updateUser(input: UpdateUserSchema & { id: number }) {
  noStore()
  try {
    await db
      .update(users)
      .set({
        email: input.email,
        emailVerified: input.emailVerified,
      })
      .where(eq(users.id, input.id))

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

export async function updateUsers(input: {
  ids: number[]
  emailVerified?: User["emailVerified"]
}) {
  noStore()
  try {
    await db
      .update(users)
      .set({
        emailVerified: input.emailVerified,
      })
      .where(inArray(users.id, input.ids))

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

export async function deleteUser(input: { id: number }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(users).where(eq(users.id, input.id))

      // Create a new user for the deleted one
      await tx.insert(users).values(generateRandomUser())
    })

    revalidatePath("/")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteUsers(input: { ids: number[] }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(users).where(inArray(users.id, input.ids))

      // Create new users for the deleted ones
      await tx.insert(users).values(input.ids.map(() => generateRandomUser()))
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

export async function getChunkedUsers(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalUsers = await db
      .select({
        count: count(),
      })
      .from(users)
      .then(takeFirstOrThrow)

    const totalChunks = Math.ceil(totalUsers.count / chunkSize)

    let chunkedTasks

    for (let i = 0; i < totalChunks; i++) {
      chunkedTasks = await db
        .select()
        .from(users)
        .limit(chunkSize)
        .offset(i * chunkSize)
        .then((users) =>
          users.map((user) => ({
            ...user,
            createdOn: user.createdOn.toString(),
            updatedOn: user.updatedOn?.toString(),
          }))
        )
    }

    return {
      data: chunkedTasks,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
