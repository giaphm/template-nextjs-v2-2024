import {
  DrizzlePostgreSQLAdapter,
  PostgreSQLUserTable,
} from '@lucia-auth/adapter-drizzle'
import { Lucia } from 'lucia'
import { db, sessionTable, userTable } from '../db'

const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable as PostgreSQLUserTable
)

const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
})

export default lucia

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    UserId: number
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  username: string
}
