import app from '@/app'
import request from 'supertest'
import { resolve } from 'node:path'
import { Task } from '@/domains/task/enterprise/entities/task'

describe('update task controller', async () => {
  beforeAll(async () => {
    // await server.isServerReady()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to update a task', async () => {
    await request(app)
      .post('/tasks')
      .set('content-type', 'application/octet-stream')
      .attach('csv', resolve(__dirname, '..', 'stream', 'content.csv'))

    const createdTasksReponse = await request(app).get('/tasks').send()

    const firstTaskId = createdTasksReponse.body.tasks[0].id

    const updatedTaskResponse = await request(app)
      .put(`/tasks/${firstTaskId}/complete`)
      .send({
        title: 'My Custom Tytle',
        description: 'My Cuscom Description',
      })

    const fetchResp = await request(app).get('/tasks').send()

    expect(updatedTaskResponse.statusCode).toEqual(201)
    expect(fetchResp.body.tasks).toHaveLength(5)
    expect(
      (fetchResp.body.tasks as Task['rawData'][]).filter(
        (item) => item.id === firstTaskId,
      )[0],
    ).toEqual(
      expect.objectContaining(<Partial<Task['rawData']>>{
        title: 'My Custom Tytle',
        description: 'My Cuscom Description',
      }),
    )
  })
})
