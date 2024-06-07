import { Either, right } from '@/core/either'
import { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'

export interface CreateTaskUseCaseRequest {
  title: string
  description: string
}

export type CreateTaskUseCaseResponse = Either<
  null,
  {
    task: Task
  }
>

export class CreateTaskUseCase {
  constructor(protected tasksRepository: TasksRepository) {}

  async execute(
    props: CreateTaskUseCaseRequest,
  ): Promise<CreateTaskUseCaseResponse> {
    const newTask = Task.create(props)

    const task = await this.tasksRepository.create(newTask)

    return right({ task })
  }
}
