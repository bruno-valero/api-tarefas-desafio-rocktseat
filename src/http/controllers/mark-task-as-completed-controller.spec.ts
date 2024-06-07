import app from '@/app'
import request, { Response } from 'supertest'
import { resolve } from 'node:path'
import { Task } from '@/domains/task/enterprise/entities/task'

describe('mark task as completed controller', async () => {
  beforeAll(async () => {
    // await server.isServerReady()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to mark a task as completed', async () => {
    await request(app)
      .post('/tasks')
      .set('content-type', 'application/octet-stream')
      .attach('csv', resolve(__dirname, '..', 'stream', 'content.csv'))

    const createdTasksReponse = await request(app).get('/tasks').send()

    const firstTaskId = createdTasksReponse.body.tasks[0].id

    const completedTaskResponse = await request(app)
      .patch(`/tasks/${firstTaskId}/complete`)
      .send()

    const fetchResp = await request(app).get('/tasks').send()

    function findFirstTask(id: string, resp: Response) {
      return (resp.body.tasks as Task['rawData'][]).filter(
        (item) => item.id === id,
      )[0]
    }

    expect(completedTaskResponse.statusCode).toEqual(201)
    expect(fetchResp.body.tasks).toHaveLength(5)
    expect(findFirstTask(firstTaskId, createdTasksReponse)).toEqual(
      expect.objectContaining({
        completed_at: null,
      }),
    )
    expect(findFirstTask(firstTaskId, fetchResp)).toEqual(
      expect.objectContaining(<Partial<Task['rawData']>>{
        completed_at: expect.any(String),
      }),
    )
  })
})
