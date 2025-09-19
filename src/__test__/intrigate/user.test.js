import supertest from "supertest";
import { TOKEN } from '../server.test.js'
import app from '../../app.js'
import connectMongoDB from '../../config/db.js'




beforeAll(async ()=>{
    await connectMongoDB('test')
})

const createInvalidUser = {
    userName: 'testUserOne',
    email: 'test@example.com',
    password: 'arif8322',
    
    
}

const createUser = {
      userName: 'testOne',
      email: 'testOne@gmail.com',
      password: 'Arif@8321',
}


describe('User', () => {
    describe('create user', () => {
        describe('given invalid argument', () => {
            it('should return 400 error', async () => {
                const response = await supertest(app)
                    .post('/api/v1/users')
                    .set('authorization', TOKEN)
                    .send(createInvalidUser)
                expect(response.status).toBe(400)
            })
        })

        describe('no auth token', () => {
            it('should return 401 error', async () => {
                const response = await supertest(app)
                    .post('/api/v1/users')
                    .send({
                        userName: 'test',
                        email: 'test@gmail.com'
                    })
                expect(response.status).toBe(401)
            })
        })

        describe('given valid argument', () => {
            it('should return 201 and create user', async () => {
                const response = await supertest(app)
                    .post('/api/v1/users')
                    .set('authorization', TOKEN)  
                    .send(createUser)

                    console.log(response.body)
                expect(response.status).toBe(201)       
                
            })
        })
    })
})


