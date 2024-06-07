import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'

export interface UpdateTaskUseCaseRequest {
  taskId: string
  title: string
  description: string
}

export type UpdateTaskUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    task: Task
  }
>

export class UpdateTaskUseCase {
  constructor(protected tasksRepository: TasksRepository) {}

  async execute({
    description,
    title,
    taskId,
  }: UpdateTaskUseCaseRequest): Promise<UpdateTaskUseCaseResponse> {
    const task = await this.tasksRepository.getById(taskId)

    if (!task) return left(new ResourceNotFoundError())

    task.title = title
    task.description = description

    await this.tasksRepository.update(task)

    return right({ task })
  }
}
