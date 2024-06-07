import { Req, Res, server } from '@/customServer'
import { PrismaTasksRepository } from '@/domains/task/application/repositories/prisma/prisma-tasks-repository'
import { MarkTaskAsCompletedUseCase } from '@/domains/task/application/use-cases/mark-task-as-completed-use-case'
import z from 'zod'

export async function markTaskAsCompletedController(req: Req, res: Res) {
  await server.handleBody()

  const paramsSchema = z.object({
    id: z.string(),
  })

  const params = paramsSchema.parse(req.params)

  const repository = new PrismaTasksRepository()
  const useCase = new MarkTaskAsCompletedUseCase(repository)
  await useCase.execute({ taskId: params.id })

  res.writeHead(201).end()
}
