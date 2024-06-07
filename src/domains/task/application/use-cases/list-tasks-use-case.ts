import { Either, right } from '@/core/either'
import { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'

export interface ListTasksUseCaseRequest {}

export type ListTasksUseCaseResponse = Either<
  null,
  {
    tasks: Task[]
  }
>

export class ListTasksUseCase {
  constructor(protected tasksRepository: TasksRepository) {}

  async execute(
    props: ListTasksUseCaseRequest, // eslint-disable-line
  ): Promise<ListTasksUseCaseResponse> {
    const tasks = await this.tasksRepository.fetchMany()

    return right({ tasks })
  }
}
