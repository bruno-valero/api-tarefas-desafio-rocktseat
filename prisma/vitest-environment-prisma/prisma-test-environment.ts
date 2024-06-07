import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'

// postgresql://docker:docker@localhost:5432/apisolid?schema=public

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL_NEW)
    throw new Error('provide a DATABASE_URL_NEW environment variable.')

  const url = new URL(process.env.DATABASE_URL_NEW)
  url.searchParams.set('schema', schema)

  return url.toString()
}

const prisma = new PrismaClient()

export default <Environment>{
  name: 'prisma',
  transformMode: 'web',
  async setup() {
    console.log('setting up!')
    const schema = randomUUID()
    const DATABASE_URL_NEW = generateDatabaseUrl(schema)
    process.env.DATABASE_URL_NEW = DATABASE_URL_NEW
    console.log('DATABASE_URL_NEW:', DATABASE_URL_NEW)
    console.log('process.env.DATABASE_URL_NEW:', process.env.DATABASE_URL_NEW)

    console.log('executando', 'npx prisma migrate deploy')
    const exexResp = execSync('npx prisma migrate deploy')
    console.log('exexResp', exexResp)
    console.log(
      `*****************************************************************************************`,
    )
    console.log(`\n\n\n\n`)

    return {
      async teardown() {
        console.log(`deleting schema ${schema}`)
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
