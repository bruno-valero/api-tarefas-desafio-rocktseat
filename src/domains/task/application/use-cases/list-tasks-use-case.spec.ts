import { makeTask } from '@/core/factories/make-task'
import { InMemoryTasksRepository } from '../repositories/in-memory-repositories/in-memory-tasks-repository'
import { ListTasksUseCase } from './list-tasks-use-case'

let tasksRepository: InMemoryTasksRepository
let sut: ListTasksUseCase

describe('create task use case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new ListTasksUseCase(tasksRepository)
  })

  it('should be able to create a new task', async () => {
    for (let i = 1; i <= 15; i++) {
      await tasksRepository.create(makeTask())
    }

    const tasks = await sut.execute({})

    expect(tasks.isRight())
    if (tasks.isRight()) {
      expect(tasks.value.tasks).toHaveLength(15)
    }
  })
})
