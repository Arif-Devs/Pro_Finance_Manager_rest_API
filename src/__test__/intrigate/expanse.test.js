const supertest = require("supertest");
import mongoose from "mongoose";
import Expanse from "../../model/expanse.js";
import { TOKEN } from "../server.test.js";
import app from "./../../app.js"
import Category from "../../model/category.js";
import User from "../../model/user.js";
import Account from "../../model/account.js";
import connectMongoDB from '../../config/db.js'




const createExpanse = {
    amount : 1000,
}



beforeAll(async () => {
    await connectMongoDB('test');
});

//done
describe('Expanse', () => {
   let dataTrack = [];
    describe('Expanse Create', () => {
        describe('given valid argument', () => {
            it('should return a expanse object', async () => {
                const categoryId = await Category.findOne({}).exec()
                const userId = await User.findOne({}).exec()
                const accountId = await Account.findOne({}).exec()
                const response = await supertest(app)
                .post('/api/v1/expanses')
                .set('Authorization' , TOKEN)
                .send({
                    ...createExpanse,
                    categoryId : categoryId._id,
                    userId : userId._id,
                    accountId : accountId._id
                });
                dataTrack.push(response?._body?.data?._id);
                expect(response.status).toBe(201)
            });
        });

        //done
        describe('given invalid argument', () => { 
            it('should return 400 error', async () => {
                const response = await supertest(app)
                .post('/api/v1/expanses')
                .set('Authorization' , TOKEN)
                .send(createExpanse);
                expect(response.status).toBe(400)
            });  
        });

        //done
        describe('given no authorization Token', () => {
           it('should return 401 error', async () => {
                const response = await supertest(app)
                .post('/api/v1/expanses')
                .send(createExpanse);
                expect(response.status).toBe(401)
           });
            
        });
        
        
        
    });

        
    describe('Get All Expanse', () => {
        describe('given valid params and auth token', () => {
            it('should return 200', async () => {
                const expanses = await supertest(app)
                .get('/api/v1/expanses')
                .set('authorization', TOKEN)
                expect(expanses.status).toBe(200)
                expect(expanses._body).toHaveProperty('data')
            });  
        });
    });


    describe('Get Single Expanse', () => {
        describe('given valid id params and auth token', () => {
            it('should return 200', async () => {
                const expanse =  await Expanse.findOne({}).exec();
                const expanses = await supertest(app)
                .get(`/api/v1/expanses/${expanse._id}`)
                .set('Authorization', TOKEN)
                expect(expanses.status).toBe(200)
                expect(expanses._body).toHaveProperty('data')
            });  
        });
    });


    describe('Delete Expanse', () => {
        it('Should Delete Expanse', async () => {
            const expanse = await Expanse.findOne()
            const response = await supertest(app)
                .delete(`/api/v1/expanses/${expanse._id}`)
                .set('authorization', TOKEN);
          
                expect(response.status).toBe(204);
             
        });
    });


    // describe('Expanse Update By Put', () => {
    //     describe('given not exits Id params', () => {
    //         it('should return a newly created Expanses with 201', async () => {
    //             const expanseId = new mongoose.Types.ObjectId().toString()
    //             const categoryId = await Category.findOne().exec()
    //             const userId = await User.findOne().exec()
    //             const accountId = await Account.findOne().exec()
    //             const expanses = await supertest(app)
    //             .put(`/api/v1/expanses/${expanseId}`)
    //             .set('authorization', TOKEN)
    //             .send({
    //                 ...createExpanse,
    //                 categoryId : categoryId._id,
    //                 userId : userId._id,
    //                 accountId : accountId._id

    //             })
    //             expect(expanses.status).toBe(201)
    //             expect(expanses._body).toHaveProperty('data')
    //         }); 
    //     });

    //     describe('given exits Id params', () => {
    //         it('should return updated Expanses with 200', async () => {
    //             const expanseId = await Expanse.findOne().exec()
    //             const expanses = await supertest(app)
    //             .put(`/api/v1/expanses/${expanseId._id}`)
    //             .set('authorization', TOKEN)
    //             .send(createExpanse)
    //             expect(expanses.statusCode).toBe(200)
    //             expect(expanses._body).toHaveProperty('data')
    //         }); 
    //     });     
    // });


});