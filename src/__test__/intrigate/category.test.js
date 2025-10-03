import supertest from "supertest";
import { TOKEN } from '../server.test.js'
import app from '../../app.js'
import connectMongoDB from '../../config/db.js'
import Category from "../../model/category.js";
import { createCategoryMock, updateCategoryMock } from "../mock/category.js";
import mongoose from "mongoose";


beforeAll(async () => {
  await connectMongoDB('test');
});

describe('category', () => {
  const trackData = [];

  it('should return 400 when category already exists', async () => {
    await Category.create(createCategoryMock);

    const response = await supertest(app)
      .post('/api/v1/categories')
      .set('authorization', TOKEN)
      .send(createCategoryMock);

    expect(response.status).toBe(400);
  });
});



describe('get all category', ()=>{
    it('given valid header and return 200', async()=>{
        const response = await supertest(app)
            .get('/api/v1/categories')
            .set('authorization', TOKEN)
            expect(response.status).toBe(200)
    })
})


describe('without authorization', ()=>{
    it('should return 401', async()=>{
        const response = await supertest(app)
            .get('/api/v1/categories')
            .set('authorization', '')
            expect(response.status).toBe(401)
    })
})

describe('delete', () => {
  describe('delete category', () => {
    it('should delete category', async () => {    
      const category = await Category.findOne();
      const response = await supertest(app)
        .delete(`/api/v1/categories/${category._id}`)
        .set('authorization', TOKEN);

      expect(response.status).toBe(204);

    });
  });
});


describe("create or update", () => {
  it("should create a new category if it does not exist create a new one", async () => {
   
    const categoryId = new mongoose.Types.ObjectId().toString();

    const createResponse = await supertest(app)
      .put(`/api/v1/categories/${categoryId}`)
      .set("authorization", TOKEN)
      .send({ name: "test category" });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data).toHaveProperty("_id");
    expect(createResponse.body.data.name).toBe("test category");

    const createdCategoryId = createResponse.body.data._id;

    const created = await Category.findById(createdCategoryId);
    expect(created).not.toBeNull();
    expect(created.name).toBe("test category");

  
    const updateResponse = await supertest(app)
      .put(`/api/v1/categories/${createdCategoryId}`)
      .set("authorization", TOKEN)
      .send(updateCategoryMock);

    
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.name).toBe(updateCategoryMock.name);

    const updated = await Category.findById(createdCategoryId);
    expect(updated.name).toBe(updateCategoryMock.name);
  });
});

