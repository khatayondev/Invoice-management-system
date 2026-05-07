import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Prisma CLI doesn't auto-load .env in v7
const DATABASE_URL = process.env.DATABASE_URL || `file:${path.join(__dirname, 'prisma', 'dev.db')}`

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: DATABASE_URL,
  },
})


