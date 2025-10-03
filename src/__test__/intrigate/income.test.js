const supertest = require("supertest");
import mongoose from "mongoose";
import { TOKEN } from "../server.test.js";
import app from "./../../app.js"
import Category from "../../model/category.js";
import User from "../../model/user.js";
import Account from "../../model/account.js";
import connectMongoDB from '../../config/db.js'
import Income from "../../model/income.js";


beforeAll(async () => {
    await connectMongoDB('test');
});

const createIncome = {
    amount : 1000,
}


describe('Income', () => {
   let dataTrack = [];
    describe('Income Create', () => {
        describe('given valid argument', () => {
            it('should return a income object', async () => {
                const categoryId = await Category.findOne({}).exec()
                const userId = await User.findOne({}).exec()
                const accountId = await Account.findOne({}).exec()
                const response = await supertest(app).post('/api/v1/incomes')
                .set('Authorization' , TOKEN)
                .send({
                    ...createIncome,
                    categoryId : categoryId._id,
                    userId : userId._id,
                    accountId : accountId._id
                });
                dataTrack.push(response?._body?.data?._id);
                expect(response.status).toBe(201)
            });
        });

        describe('given invalid argument', () => {
            it('should return 400 error', async () => {
                const response = await supertest(app)
                .post('/api/v1/incomes')
                .set('Authorization' , TOKEN)
                .send(createIncome);
                expect(response.status).toBe(400)
            });  
        });

        describe('given no Authorization Token', () => {
           it('should return 401 error', async () => {
                const response = await supertest(app)
                .post('/api/v1/incomes')
                .send(createIncome);
                expect(response.status).toBe(401)
           });
            
        });
        
        
        
    });

    describe('Get All Income', () => {
        describe('given valid params and auth token', () => {
            it('should return 200', async () => {
                const incomes = await supertest(app)
                .get('/api/v1/incomes')
                .set('authorization', TOKEN)
                expect(incomes.status).toBe(200)
                expect(incomes._body).toHaveProperty('data')
            });  
        });
    });


    describe('Get Single Income', () => {
        describe('given valid id params and auth token', () => {
            it('should return 200', async () => {
                const income =  await Income.findOne({}).exec();
                const response = await supertest(app)
                .get(`/api/v1/incomes/${income._id}`)
                .set('authorization', TOKEN)
                expect(response.status).toBe(200)
                expect(response._body).toHaveProperty('data')
            });  
        });
    });


    describe('Delete Income', () => {
        it('Should Delete Income', async () => {
            const income = await Income.findOne()
            const response = await supertest(app)
                .delete(`/api/v1/incomes/${income._id}`)
                .set('authorization', TOKEN);
                expect(response.status).toBe(204);
            
        });
    });


    // describe('Income Update By Put', () => {
    //     describe('given not exits Id params', () => {
    //         it('should return a newly created Incomes with 201', async () => {
    //             const incomeId =await Income.findOne({}).exec()
    //             const categoryId = await Category.findOne({}).exec()
    //             const userId = await User.findOne({}).exec()
    //             const accountId = await Account.findOne({}).exec()
    //             const incomes = await supertest(app)
    //             .put(`/api/v1/incomes/${incomeId._id}`)
    //             .set('authorization', TOKEN)
    //             .send({
    //                 ...createIncome,
    //                 categoryId : categoryId._id,
    //                 userId : userId._id,
    //                 accountId : accountId._id

    //             })
    //             //dataTrack.push(incomes?._body?.data?._id);
    //             expect(incomes.status).toBe(201)
    //             expect(incomes._body).toHaveProperty('data')
    //         }); 
    //     });

    //     describe('given exits Id params', () => {
    //         it('should return updated Incomes with 200', async () => {
    //             const incomeId = await Income.findOne({}).exec()
    //             const incomes = await supertest(app)
    //             .put(`/api/v1/incomes/${incomeId._id}`)
    //             .set('authorization', TOKEN)
    //             .send(createIncome)
    //             expect(incomes.status).toBe(200)
    //             expect(incomes._body).toHaveProperty('data')
    //         }); 
    //     });     
    // });


});