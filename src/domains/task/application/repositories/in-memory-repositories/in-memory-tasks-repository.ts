import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Task } from '@/domains/task/enterprise/entities/task'
import { TasksRepository } from '../tasks-repository'

export class InMemoryTasksRepository implements TasksRepository {
  items: Task[] = []

  async create(task: Task): Promise<Task> {
    this.items.push(task)

    return task
  }

  async update(task: Task): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.value === task.id.value,
    )

    if (index < 0) throw new ResourceNotFoundError()

    this.items[index] = task
  }

  async deleteById(taskId: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.value === taskId)

    if (index < 0) throw new ResourceNotFoundError()

    this.items.splice(index, 1)
  }

  async getById(taskId: string): Promise<Task | null> {
    return this.items.filter((item) => item.id.value === taskId)[0] ?? null
  }

  async fetchMany(): Promise<Task[]> {
    return this.items
  }
}
