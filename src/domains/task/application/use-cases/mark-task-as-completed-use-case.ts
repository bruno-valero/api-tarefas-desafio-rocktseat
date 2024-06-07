import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'

export interface MarkTaskAsCompletedUseCaseRequest {
  taskId: string
}

export type MarkTaskAsCompletedUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    task: Task
  }
>

export class MarkTaskAsCompletedUseCase {
  constructor(protected tasksRepository: TasksRepository) {}

  async execute({
    taskId,
  }: MarkTaskAsCompletedUseCaseRequest): Promise<MarkTaskAsCompletedUseCaseResponse> {
    const task = await this.tasksRepository.getById(taskId)

    if (!task) return left(new ResourceNotFoundError())

    task.complete()

    await this.tasksRepository.update(task)

    return right({ task })
  }
}
