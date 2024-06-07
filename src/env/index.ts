import { config } from 'dotenv'
import z from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('prod'),
  DATABASE_URL_NEW: z.coerce.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success)
  throw new Error(
    `invalid environment variables: ${JSON.stringify(_env.error.format(), null, 4)}`,
  )

export const env = _env.data
