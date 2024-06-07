import { Req, Res } from '@/customServer'
import { PrismaTasksRepository } from '@/domains/task/application/repositories/prisma/prisma-tasks-repository'
import { DeleteTaskUseCase } from '@/domains/task/application/use-cases/delete-task-use-case'
import z from 'zod'

export async function deleteTaskController(req: Req, res: Res) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const params = paramsSchema.parse(req.params)

  const repository = new PrismaTasksRepository()
  const useCase = new DeleteTaskUseCase(repository)
  await useCase.execute({ taskId: params.id })

  res.writeHead(204).end()
}
