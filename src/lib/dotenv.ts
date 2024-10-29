import { config } from "dotenv"
import * as path from "path"

// Initializing dotenv
const envPath: string = path.resolve(
  __dirname,
  process.env.NODE_ENV === "test"
    ? "../../.env.test"
    : "../../.env.development.local"
)
config({ path: envPath })
