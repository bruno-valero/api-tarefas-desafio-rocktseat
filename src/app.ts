// import fastify from 'fastify'
// import { ZodError } from 'zod'
// import { env } from './env'
import { taskRoutes } from './http/routes/task-routes'
import http from 'node:http'
import { server } from './customServer'

// import multipart from '@fastify/multipart'
const app = http.createServer(async (req, res) => {
  // console.log(req)
  server.setReq(req)
  server.setRes(res)
  // await server.handleBody()
  await taskRoutes(server)
  // server.setServerSettingUp()
})

// app.register(multipart)

// app.register(taskRoutes, { prefix: '/tasks' })

// app.setErrorHandler((err, _req, res) => {
//   if (env.NODE_ENV !== 'prod') {
//     console.error(`err:`, err)
//   }
//   if (err instanceof ZodError) {
//     return res
//       .status(400)
//       .send({ message: 'Validation error', issues: err.format() })
//   }
//   return res.status(500).send({ message: 'Internal server error.' })
// })

export default app
