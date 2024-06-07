import { Req, Res, server } from '@/customServer'
import { PrismaTasksRepository } from '@/domains/task/application/repositories/prisma/prisma-tasks-repository'
import { UpdateTaskUseCase } from '@/domains/task/application/use-cases/update-task-use-case'
import z from 'zod'

export async function updateTaskController(req: Req, res: Res) {
  await server.handleBody()

  const paramsSchema = z.object({
    id: z.string(),
  })

  const bodySchema = z.object({
    title: z.string(),
    description: z.string(),
  })

  const body = bodySchema.parse(JSON.parse(req.body ?? ''))
  const params = paramsSchema.parse(req.params)

  const repository = new PrismaTasksRepository()
  const useCase = new UpdateTaskUseCase(repository)
  await useCase.execute({ ...body, taskId: params.id })

  res.writeHead(201).end()
}
