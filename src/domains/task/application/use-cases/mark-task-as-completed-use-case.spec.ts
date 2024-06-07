import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeTask } from '@/core/factories/make-task'
import { InMemoryTasksRepository } from '../repositories/in-memory-repositories/in-memory-tasks-repository'
import { MarkTaskAsCompletedUseCase } from './mark-task-as-completed-use-case'

let tasksRepository: InMemoryTasksRepository
let sut: MarkTaskAsCompletedUseCase

describe('mark task as completed use case', () => {
  beforeEach(() => {
    tasksRepository = new InMemoryTasksRepository()
    sut = new MarkTaskAsCompletedUseCase(tasksRepository)
  })

  it('should be able to mark a task as completed', async () => {
    const task = await tasksRepository.create(makeTask())

    const updatedTaskResp = await sut.execute({
      taskId: task.id.value,
    })

    const taskAfterUpdate = await tasksRepository.getById(task.id.value)

    expect(updatedTaskResp.isRight())
    if (updatedTaskResp.isRight()) {
      expect(taskAfterUpdate?.completed_at).toEqual(expect.any(Date))
    }
  })

  it('should no be able to mark a inexistent task as completed', async () => {
    await tasksRepository.create(makeTask())

    const updatedTaskResp = await sut.execute({
      taskId: 'id inexistent',
    })

    const taskAfterUpdate = await tasksRepository.getById('id inexistent')

    expect(updatedTaskResp.isLeft())
    expect(taskAfterUpdate).toBeNull()
    expect(updatedTaskResp.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
