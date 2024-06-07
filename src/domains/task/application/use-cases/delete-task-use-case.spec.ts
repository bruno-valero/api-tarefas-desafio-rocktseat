import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeTask } from '@/core/factories/make-task'
import { InMemoryTasksRepository } from '../repositories/in-memory-repositories/in-memory-tasks-repository'
import { DeleteTaskUseCase } from './delete-task-use-case'

let tasksRepository: InMemoryTasksRepository
let sut: DeleteTaskUseCase

describe('delete task use case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new DeleteTaskUseCase(tasksRepository)
  })

  it('should be able to delete a task', async () => {
    const task = await tasksRepository.create(makeTask())

    const deletedTaskResp = await sut.execute({
      taskId: task.id.value,
    })

    const taskAfterDelete = await tasksRepository.getById(task.id.value)

    expect(deletedTaskResp.isRight())
    expect(taskAfterDelete).toBeNull()
  })

  it('should no be able to delete an inexistent task', async () => {
    await tasksRepository.create(makeTask())

    const deletedTaskResp = await sut.execute({
      taskId: 'id inexistent',
    })

    const taskAfterDelete = await tasksRepository.getById('id inexistent')

    expect(deletedTaskResp.isLeft())
    expect(taskAfterDelete).toBeNull()
    expect(deletedTaskResp.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
