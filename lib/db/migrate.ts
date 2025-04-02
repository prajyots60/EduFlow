import { migrate } from "drizzle-orm/neon-http/migrator"
import { db } from ".."
import * as dotenv from "dotenv"

dotenv.config()

async function main() {
  console.log("Migration started...")

  try {
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migration completed successfully!")
  } catch (error) {
    console.error("Migration failed:", error)
    process.exit(1)
  }

  process.exit(0)
}

main()

