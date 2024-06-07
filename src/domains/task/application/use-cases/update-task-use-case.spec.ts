import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeTask } from '@/core/factories/make-task'
import { InMemoryTasksRepository } from '../repositories/in-memory-repositories/in-memory-tasks-repository'
import { UpdateTaskUseCase } from './update-task-use-case'

let tasksRepository: InMemoryTasksRepository
let sut: UpdateTaskUseCase

describe('update task use case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new UpdateTaskUseCase(tasksRepository)
  })

  it('should be able to update a task', async () => {
    const task = await tasksRepository.create(makeTask())

    const updatedTaskResp = await sut.execute({
      taskId: task.id.value,
      description: 'new description',
      title: 'new title',
    })

    const taskAfterUpdate = await tasksRepository.getById(task.id.value)

    expect(updatedTaskResp.isRight())
    if (updatedTaskResp.isRight()) {
      expect(taskAfterUpdate?.description).toEqual('new description')
      expect(taskAfterUpdate?.title).toEqual('new title')
    }
  })

  it('should no be able to update an inexistent task', async () => {
    await tasksRepository.create(makeTask())

    const updatedTaskResp = await sut.execute({
      taskId: 'id inexistent',
      description: '',
      title: '',
    })

    const taskAfterUpdate = await tasksRepository.getById('id inexistent')

    expect(updatedTaskResp.isLeft())
    expect(taskAfterUpdate).toBeNull()
    expect(updatedTaskResp.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
