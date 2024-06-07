import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { TasksRepository } from '../repositories/tasks-repository'

export interface DeleteTaskUseCaseRequest {
  taskId: string
}

export type DeleteTaskUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteTaskUseCase {
  constructor(protected tasksRepository: TasksRepository) {}

  async execute({
    taskId,
  }: DeleteTaskUseCaseRequest): Promise<DeleteTaskUseCaseResponse> {
    const task = await this.tasksRepository.getById(taskId)

    if (!task) return left(new ResourceNotFoundError())

    await this.tasksRepository.deleteById(taskId)

    return right(null)
  }
}
