import {
  CreateTaskUseCase,
  CreateTaskUseCaseRequest,
} from '@/domains/task/application/use-cases/create-task-use-case'
import z, { ZodType, ZodTypeDef } from 'zod'
import { ReadFakeCsvStreamAndSaveOnDatabase } from '../stream/read-fake-csv-stream'
import { PrismaTasksRepository } from '@/domains/task/application/repositories/prisma/prisma-tasks-repository'
import { Req, Res, server } from '@/customServer'

export async function createTaskController(req: Req, res: Res) {
  const bodySchema = z.object({
    title: z.string(),
    description: z.string(),
  })

  console.log('createTaskController')
  // console.log('req.files', req.files())

  if (req.headers['content-type'] !== 'application/json') {
    console.log('is stream')

    const repository = new PrismaTasksRepository()
    const useCase = new CreateTaskUseCase(repository)
    const readFakeCsvStreamAndSaveOnDatabase =
      new ReadFakeCsvStreamAndSaveOnDatabase(
        req,
        bodySchema as ZodType<
          CreateTaskUseCaseRequest,
          ZodTypeDef,
          CreateTaskUseCaseRequest
        >,
        useCase,
      )

    await readFakeCsvStreamAndSaveOnDatabase.read()

    res.statusCode = 201
    res.end()
  } else {
    await server.handleBody()

    const body = bodySchema.parse(JSON.parse(req.body ?? ''))

    const repository = new PrismaTasksRepository()
    const useCase = new CreateTaskUseCase(repository)
    const taskResp = await useCase.execute(body)

    if (taskResp.isRight()) {
      res.writeHead(201).end()
    } else {
      throw new Error('Internal Server Error')
    }
  }
}
