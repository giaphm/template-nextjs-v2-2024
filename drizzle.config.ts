import { defineConfig } from "drizzle-kit"
import { get } from "env-var"
import "~/lib/dotenv"

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./migration",
  dialect: "postgresql",
  dbCredentials: {
    url: get("POSTGRES_URL").required().asString(),
    ssl: true,
  },
})
