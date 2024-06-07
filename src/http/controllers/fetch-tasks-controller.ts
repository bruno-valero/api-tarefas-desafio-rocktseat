import { Req, Res } from '@/customServer'
import { PrismaTasksRepository } from '@/domains/task/application/repositories/prisma/prisma-tasks-repository'
import { ListTasksUseCase } from '@/domains/task/application/use-cases/list-tasks-use-case'

export async function fetchTasksController(req: Req, res: Res) {
  const repository = new PrismaTasksRepository()
  const useCase = new ListTasksUseCase(repository)
  const tasksResp = await useCase.execute({})

  if (tasksResp.isRight()) {
    const tasks = tasksResp.value.tasks.map((item) => item.rawData)
    res
      .writeHead(200, {
        'content-type': 'application/json',
      })
      .end(JSON.stringify({ tasks }))
  } else {
    throw new Error('Internal Server Error')
  }
}
