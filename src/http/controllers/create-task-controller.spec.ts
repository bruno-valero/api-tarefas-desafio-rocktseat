import app from '@/app'
import request from 'supertest'
import { resolve } from 'node:path'

describe('create task controller', async () => {
  beforeAll(async () => {
    // await server.isServerReady()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to create a new task', async () => {
    const resp = await request(app).post('/tasks').send({
      title: 'my title',
      description: 'my description',
    })

    const fetchResp = await request(app).get('/tasks').send()

    expect(resp.statusCode).toEqual(201)
    expect(fetchResp.body.tasks).toHaveLength(1)
    expect(fetchResp.body.tasks[0]).toEqual(
      expect.objectContaining({
        title: 'my title',
        description: 'my description',
      }),
    )
    // expect(fetchResp.statusCode).toEqual(200)
    // expect(fetchResp.body.tasks).toHaveLength(1)
  })

  it('should be able to import many tasks via csv', async () => {
    // const fakeCsvWritable = new FakeCsvWritable()
    // const fakeCsvReadable = new FakeCsvReadable()
    const req = await request(app)
      .post('/tasks')
      .set('content-type', 'application/octet-stream')
      .attach('csv', resolve(__dirname, '..', 'stream', 'content.csv'))

    // fakeCsvReadable
    //   .on('end', async () => await req.end())
    //   .pipe(req.write, { end: false })

    const fetchResp = await request(app).get('/tasks').send()

    expect(req.statusCode).toEqual(201)
    const amountCreatedByTheFirstTest = 1
    const amountCreatedViaCsv = 5
    const amountOfTasksCreated =
      amountCreatedByTheFirstTest + amountCreatedViaCsv
    expect(fetchResp.body.tasks).toHaveLength(amountOfTasksCreated)
  })
})
