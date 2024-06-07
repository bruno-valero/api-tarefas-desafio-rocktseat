import { InMemoryTasksRepository } from '../repositories/in-memory-repositories/in-memory-tasks-repository'
import { CreateTaskUseCase } from './create-task-use-case'

let tasksRepository: InMemoryTasksRepository
let sut: CreateTaskUseCase

describe('create task use case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new CreateTaskUseCase(tasksRepository)
  })

  it('should be able to create a new task', async () => {
    const createdTask = await sut.execute({
      title: 'teste',
      description: 'descricaoo',
    })

    expect(createdTask.isRight())
    if (createdTask.isRight()) {
      const task = await tasksRepository.getById(
        createdTask.value.task.id.value,
      )

      expect(task?.title).toEqual('teste')
    }
  })
})
