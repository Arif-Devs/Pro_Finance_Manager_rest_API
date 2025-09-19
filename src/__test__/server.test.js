import dotenv from 'dotenv'
import app from './../app.js'
import supertest from 'supertest'
dotenv.config()
const PORT = process.env.PORT || 4000
import connectMongoDB from '../config/db'


export const TOKEN = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODg0ZWVjYjkwYjhhM2MyOTUyYTI1ZWEiLCJ1c2VyTmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20iLCJyb2xlSWQiOiI2ODg0ZWVjYjkwYjhhM2MyOTUyYTI1OWUiLCJjcmVhdGVkQXQiOiIyMDI1LTA3LTI2VDE1OjA1OjQ3Ljc0OVoiLCJ1cGRhdGVkQXQiOiIyMDI1LTA3LTI2VDE1OjA1OjQ3Ljc0OVoiLCJpc3N1ZWRJcCI6IjE5Mi4xNjguMC4xNjEiLCJpYXQiOjE3NTgyODMzNjJ9.VYCUsG-8XI1gQp0Cqrdq1wQZwMWsIsbWzR4tffSUeRM`

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

