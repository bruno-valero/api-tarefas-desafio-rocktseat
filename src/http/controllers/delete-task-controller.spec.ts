import app from '@/app'
import request from 'supertest'
import { resolve } from 'node:path'
import { Task } from '@/domains/task/enterprise/entities/task'

describe('delete task controller', async () => {
  beforeAll(async () => {
    // await server.isServerReady()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to delete a task', async () => {
    await request(app)
      .post('/tasks')
      .set('content-type', 'application/octet-stream')
      .attach('csv', resolve(__dirname, '..', 'stream', 'content.csv'))

    const createdTasksReponse = await request(app).get('/tasks').send()

    const firstTaskId = createdTasksReponse.body.tasks[0].id

    const deletedResp = await request(app)
      .delete(`/tasks/${firstTaskId}`)
      .send()

    const fetchResp = await request(app).get('/tasks').send()

    expect(deletedResp.statusCode).toEqual(204)
    expect(fetchResp.body.tasks).toHaveLength(4)
    expect(
      (fetchResp.body.tasks as Task['rawData'][]).some(
        (item) => item.id === firstTaskId,
      ),
    ).toBeFalsy()
    // expect(fetchResp.statusCode).toEqual(200)
    // expect(fetchResp.body.tasks).toHaveLength(1)
  })
})
