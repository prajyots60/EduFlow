import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

neonConfig.fetchConnectionCache = true

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema })

// Simple wrapper for raw SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return {
      rows: result,
      rowCount: result.length,
    }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

