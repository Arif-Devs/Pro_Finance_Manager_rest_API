import supertest from "supertest";
import { TOKEN } from '../server.test.js'
import app from '../../app.js'
import connectMongoDB from '../../config/db.js'
import Account from "../../model/account";
import {createValidAccountMock, updateValidAccountMock} from '../mock/account.js'
import User from "../../model/user.js";


beforeAll(async ()=>{
   await connectMongoDB('test')
})


describe('account', () =>{

    const trackData = []

    it('should return all account and sent 200', async()=>{
        const response = await supertest(app)
        .get('/api/v1/accounts')
        .set('authorization', TOKEN)
        expect(response.status).toBe(200)
    })

    it('without authorization header and send 401', async ()=>{
        const response = await supertest(app)
        .get('/api/v1/accounts')
        expect(response.status).toBe(401)
    })


    describe('Account creation', () => {
    let validUser;

    beforeAll(async () => {
        validUser = await User.create({
            userName: "accountTestUser",
            email: "accountuser@example.com",
            password: "password123",
            
        });
    });

    it('create account', async () => {
        const account = await Account.findOne({ name: createValidAccountMock.name });

        const mockWithUser = {
            ...createValidAccountMock,
            userId: validUser._id.toString()
        };

        const response = await supertest(app)
            .post('/api/v1/accounts')
            .set('authorization', TOKEN)
            .send(mockWithUser);

        if (account) {
            expect(response.status).toBe(400); 
        } else {
            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('_id');
        }
    });
});


    it('create or update account', async () => {
    const account = await Account.findOne();  
    expect(account).not.toBeNull();

    const user = await User.findById(account.userId);
    expect(user).not.toBeNull();

    const updateValidAccountMock = {
        name: "updated account",
        accountDetails: "new details",
        initialValue: 200,
        userId: user._id.toString()
    };

    const response = await supertest(app)
        .put(`/api/v1/accounts/${account._id}`) 
        .set('authorization', TOKEN)
        .send(updateValidAccountMock);

    expect(response.status).toBe(200);

    const updated = await Account.findById(account._id);
    expect(updated.name).toBe("updated account");
    expect(updated.initialValue).toBe(200);
});



    it('delete account', async()=>{
       
        const account = await Account.findOne()
        const response = await supertest(app)

            .delete(`/api/v1/accounts/${account._id}`)
            .set('authorization', TOKEN)

        if(!account){
            expect(response.status).toBe(500)
        }else{
            expect(response.status).toBe(204)
        }
    })


    afterEach(async ()=>{
        trackData.forEach(async (accounts)=>{
            await Account.findByIdAndDelete(accounts)
        })
    })

})

