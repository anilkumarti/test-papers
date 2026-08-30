// @ts-nocheck
import { defineConfig } from 'prisma/config'
import path from 'node:path'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrate: {
    adapter: async () => {
      const { PrismaLibSql } = await import('@prisma/adapter-libsql')
      const dbPath = path.join(process.cwd(), 'dev.db')
      return new PrismaLibSql({ url: `file:///${dbPath}` })
    },
  },
})
