import { Task as EntityTask } from '@/domains/task/enterprise/entities/task'
import { TasksRepository } from '../tasks-repository'
import { prisma } from '@/core/prisma/prisma'
import UniqueEntityId from '@/core/entities/unique-entity-id'

export class PrismaTasksRepository implements TasksRepository {
  items: EntityTask[] = []

  async create(task: EntityTask): Promise<EntityTask> {
    const createTask = await prisma.task.create({
      data: task.rawData,
    })

    const { id, ...props } = createTask
    return EntityTask.create(props, new UniqueEntityId(id))
  }

  async update(task: EntityTask): Promise<void> {
    await prisma.task.update({
      where: {
        id: task.id.value,
      },
      data: task.rawData,
    })
  }

  async deleteById(taskId: string): Promise<void> {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })
  }

  async getById(taskId: string): Promise<EntityTask | null> {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    })
    if (!task) return null
    const { id, ...props } = task
    return EntityTask.create(props, new UniqueEntityId(id))
  }

  async fetchMany(): Promise<EntityTask[]> {
    const dbTasks = await prisma.task.findMany()
    const tasks = dbTasks.map((item) => {
      const { id, ...props } = item
      return EntityTask.create(props, new UniqueEntityId(id))
    })
    return tasks
  }
}
