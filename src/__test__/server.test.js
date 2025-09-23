import dotenv from 'dotenv'
import app from './../app.js'
import supertest from 'supertest'
dotenv.config()
const PORT = process.env.PORT || 4000
import connectMongoDB from '../config/db'



export const TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQyYmI0MmFmNjAxOTgxOTk0OTRkYzQiLCJ1c2VyTmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlSWQiOiI2OGQyYmI0MmFmNjAxOTgxOTk0OTRkNzgiLCJjcmVhdGVkQXQiOiIyMDI1LTA5LTIzVDE1OjIyOjQyLjE0N1oiLCJ1cGRhdGVkQXQiOiIyMDI1LTA5LTIzVDE1OjIyOjQyLjE0N1oiLCJpc3N1ZWRJcCI6IjE5Mi4xNjguMC4xNjEiLCJpYXQiOjE3NTg2NDA5NzV9.3hLxfy8Vumg9YJNCXmROgOrh0pSusfChaRltXdQdesI`

beforeAll(async()=>{
    await connectMongoDB('test')
})

afterAll(async () => {
    const mongoose = (await import('mongoose')).default
    await mongoose.connection.close()
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

