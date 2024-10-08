import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '~/libs/db/schema'
import 'dotenv/config'
import { get } from 'env-var'

if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env')

export const queryClient = postgres(get('DATABASE_URL').required().asString())
export const db = drizzle(queryClient, { schema })
