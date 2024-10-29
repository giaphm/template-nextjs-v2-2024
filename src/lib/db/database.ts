import * as schema from "~/lib/db/schema"
import { drizzle } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"
import "~/lib/dotenv"

export const queryClient = sql
export const db = drizzle(queryClient, { schema })
