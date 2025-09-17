import dotenv from 'dotenv'
import app from './../app.js'
import supertest from 'supertest'
dotenv.config()
const PORT = process.env.PORT || 4000
import connectMongoDB from '../config/db'


beforeAll(async()=>{
    await connectMongoDB
})

describe('GET /health', ()=>{
    it('response with 200 status code and health message', async()=>{
        const response = await supertest(app).get('/api/v1/health')
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            code: 200,
            message: 'api health is ok'
        })
    })
})