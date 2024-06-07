import app from './app'
import { env } from './env'

app.listen({ port: env.PORT }, () => {
  console.log(`listenning on port ${env.PORT}`)
})
