import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'node:path'

// Cache buster for Next.js Turbopack after Prisma 7.8.0 upgrade
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Resolve absolute path to the SQLite database to avoid CWD-relative issues
const dbPath = path.resolve(process.cwd(), 'prisma', 'dev.db')
const dbUrl = process.env.DATABASE_URL || `file:${dbPath}`

const adapter = new PrismaBetterSqlite3({
  url: dbUrl,
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

