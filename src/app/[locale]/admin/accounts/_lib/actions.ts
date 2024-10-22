"use server"

import { count, eq, inArray } from "drizzle-orm"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "~/lib/db"
import { accounts, users, type Account, NewAccount } from "~/lib/db/schema"
import { takeFirstOrThrow } from "~/lib/db/utils"

import { getErrorMessage } from "~/utils/handle-errors"

import { generateRandomAccount, generateRandomUser } from "./utils"
import type { CreateAccountSchema, UpdateAccountSchema } from "./validations"

export async function seedAccounts(input: { count: number }) {
  const count = input.count ?? 100

  try {
    const allAccounts: NewAccount[] = []

    for (let i = 0; i < count; i++) {
      allAccounts.push(generateRandomAccount())
    }

    await db.delete(accounts)

    console.log("📝 Inserting accounts", allAccounts.length)

    await db.insert(accounts).values(allAccounts).onConflictDoNothing()
  } catch (err) {
    console.error(err)
  }
}

export async function createAccount(
  input: Omit<CreateAccountSchema, "passwordConfirm">
) {
  noStore()
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(accounts)
        .values({
          userId: Number(input.userId),
          password: input.password,
          accountType: input.accountType,
          githubId: input.githubId,
          googleId: input.googleId,
          salt: input.salt,
        })
        .returning({
          id: accounts.id,
        })
        .then(takeFirstOrThrow)

      // // Delete a account to keep the total number of accounts constant
      // await tx.delete(accounts).where(
      //   eq(
      //     accounts.id,
      //     (
      //       await tx
      //         .select({
      //           id: accounts.id,
      //         })
      //         .from(accounts)
      //         .limit(1)
      //         .where(not(eq(accounts.id, newAccount.id)))
      //         .orderBy(asc(accounts.createdOn))
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

export async function updateAccount(
  input: Omit<UpdateAccountSchema, "passwordConfirm"> & { id: number }
) {
  noStore()
  try {
    await db
      .update(accounts)
      .set({
        password: input.password,
        accountType: input.accountType,
        githubId: input.githubId,
        googleId: input.googleId,
      })
      .where(eq(accounts.id, input.id))

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

export async function updateAccountTypeAccount(
  input: Pick<UpdateAccountSchema, "accountType"> & { id: number }
) {
  noStore()
  try {
    await db
      .update(accounts)
      .set({
        accountType: input.accountType,
      })
      .where(eq(accounts.id, input.id))

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

export async function updateAccounts(input: {
  ids: number[]
  accountType?: Account["accountType"]
}) {
  noStore()
  try {
    await db
      .update(accounts)
      .set({ accountType: input.accountType })
      .where(inArray(accounts.id, input.ids))

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

export async function deleteAccount(input: { id: number }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(accounts).where(eq(accounts.id, input.id))

      // Create a new account for the deleted one
      const [newUser] = await tx
        .insert(users)
        .values(generateRandomUser())
        .returning()
      await tx.insert(accounts).values(generateRandomAccount(newUser.id))
    })

    revalidatePath("/")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteAccounts(input: { ids: number[] }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(accounts).where(inArray(accounts.id, input.ids))

      // Create new accounts for the deleted ones
      const [newUser] = await tx
        .insert(users)
        .values(generateRandomUser())
        .returning()
      await tx
        .insert(accounts)
        .values(input.ids.map(() => generateRandomAccount(newUser.id)))
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

export async function getChunkedAccounts(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalAccounts = await db
      .select({
        count: count(),
      })
      .from(accounts)
      .then(takeFirstOrThrow)

    const totalChunks = Math.ceil(totalAccounts.count / chunkSize)

    let chunkedAccounts

    for (let i = 0; i < totalChunks; i++) {
      chunkedAccounts = await db
        .select()
        .from(accounts)
        .limit(chunkSize)
        .offset(i * chunkSize)
        .then((accounts) =>
          accounts.map((account) => ({
            ...account,
            createdOn: account.createdOn.toString(),
            updatedOn: account.updatedOn?.toString(),
          }))
        )
    }

    return {
      data: chunkedAccounts,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
