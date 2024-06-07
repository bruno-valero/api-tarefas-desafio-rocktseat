import app from '@/app'
import request from 'supertest'

describe('fetch tasks controller', async () => {
  beforeAll(async () => {
    // await server.isServerReady()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch all tasks', async () => {
    await request(app).post('/tasks').send({
      title: 'my title',
      description: 'my description',
    })

    const fetchResp = await request(app).get('/tasks').send()

    expect(fetchResp.statusCode).toEqual(200)
    expect(fetchResp.body.tasks).toHaveLength(1)
  })
})
