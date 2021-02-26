import request from 'supertest'
import { getConnection } from 'typeorm';
import { app } from '../app';
import createConnection from '../database'

describe('Survey', () => {
  beforeAll(async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    const connection = await getConnection()
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title: 'valid_title',
      description: 'valid_description'
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  });

  it("should be able to get all serveys", async () => {
    await request(app).post('/surveys').send({
      title: 'valid_title2',
      description: 'valid_description2'
    })

    const response = await request(app).get('/surveys')

    expect(response.body.length).toBe(2)
  })
});