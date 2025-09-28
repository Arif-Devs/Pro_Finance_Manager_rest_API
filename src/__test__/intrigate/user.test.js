import supertest from "supertest";
import { TOKEN } from '../server.test.js'
import app from '../../app.js'
import connectMongoDB from '../../config/db.js'
import mongoose from "mongoose";
import User from "../../model/user.js";





beforeAll(async ()=>{
    await connectMongoDB('test')
})

const createInvalidUser = {
    userName: 'testUserOne',
    email: 'test@.com',
    password: 'arif8322',
    
    
}

const createUser = {
      userName: 'userOne',
      email: 'testOne@gmail.com',
      password: 'Arif@8321',
      confirm_password: 'Arif@8322'
}

const updateUser = {
    userName: 'updatedUser',
    email: 'update@gmail.com',
    password: 'Arif@8322',
    confirm_password: 'Arif@8322'
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


// describe('given valid argument', () => {
//     it('should return 201 and create user', async () => {
//         const response = await supertest(app)
//             .post('/api/v1/users')
//             .set('authorization', TOKEN)  
//             .send(createUser)
//         expect(response.status).toBe(201)       
        
//     })
// })

describe('Get all users', ()=>{
    describe('given valid token and return all users', ()=>{
        it('should return 200', async ()=> {
            const response = await supertest(app)
            .get('/api/v1/users')
            .set('authorization', TOKEN)
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('result')
        })
    })
})

describe('get single user', ()=>{
    describe('given valid token and return single user', ()=>{
        it('Should return 200', async ()=>{
            const user = await User.findOne({})
            const response = await supertest(app)
            .get(`/api/v1/users/${user._id}`)
            .set('authorization', TOKEN)
            expect(response.status).toBe(200)
            expect(response._body).toHaveProperty('data')
        })
    })
})


describe('Delete user', ()=>{
    it('Should delete user', async ()=>{
        const userId = new mongoose.Types.ObjectId().toString()
        const user = await User.findById(userId)
        const response = await supertest(app)
            .delete(`/api/v1/users/${userId}`)
            .set('authorization', TOKEN)
        if(!user){
            expect(response.status).toBe(500)
        }else{
            expect(response.status).toBe(204)
        }
    })
})

describe('Update user by put', ()=>{
    describe('given exist id params', ()=>{
        it('Should return updated user with 200', async()=>{
            const userId = await User.findOne({}).exec()
            const response = await supertest(app)
                .put(`/api/v1/users/${userId._id}`)
                .set('authorization', TOKEN)
                .send(updateUser)
                console.log(response.body);
                
                expect(response.status).toBe(200)
                expect(response._body).toHaveProperty('data')
        })
    })
})