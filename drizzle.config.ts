import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'
import { get } from 'env-var'

export default defineConfig({
  schema: './src/libs/db/schema.ts',
  out: './migration',
  dialect: 'postgresql',
  dbCredentials: {
    host: get('DB_HOST').required().asString(),
    port: get('DB_PORT').required().asIntPositive(),
    user: get('DB_USERNAME').required().asString(),
    password: get('DB_PASSWORD').required().asString(),
    database: get('DB_NAME').required().asString(),
    ssl: false,
  },
})
