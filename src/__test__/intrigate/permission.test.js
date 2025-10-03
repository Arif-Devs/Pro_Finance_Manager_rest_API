import supertest from 'supertest';
import app from '../../app.js'; 
import connectMongoDB from '../../config/db.js';
import { createPermissionMock, updatePermissionMock } from '../mock/permission.js'; 
import { TOKEN } from '../server.test.js'; 
import Permission from '../../model/permission.js';
import mongoose from 'mongoose';

beforeAll(async () => {
  await connectMongoDB('test');
});

describe('Permission', () => {

  
  it('GET All Permission with Authorization Header should return 200 response', async () => {
    const response = await supertest(app)
      .get('/api/v1/permissions')
      .set('authorization', TOKEN);

    expect(response.status).toBe(200);
  });

  it('GET All Permission without Authorization Header should return 401 response', async () => {
    const response = await supertest(app)
      .get('/api/v1/permissions')
      expect(response.status).toBe(401);
  });

  it('POST Create Permission', async () => {
    const permission = await Permission.findOne({ name: createPermissionMock.name }).exec();
    const response = await supertest(app)
      .post('/api/v1/permissions')
      .set('authorization', TOKEN)
      .send(createPermissionMock);

    if (permission) {
      expect(response.status).toBe(400);
    } else {
      expect(response.status).toBe(201);
    }
  });

  it('PUT Create or Update Permission', async () => {
    const permissionId = new mongoose.Types.ObjectId().toString();
    const Unique = await Permission.findOne({name : updatePermissionMock.name}).exec()
    const permission = await Permission.findById(permissionId);
    const response = await supertest(app)
      .put(`/api/v1/permissions/${permissionId}`)
      .set('authorization', TOKEN)
      .send(updatePermissionMock);
    if (permission) {
      expect(response.status).toBe(200);
    } else {
      if(!Unique){
        dataTrack.push(response._body.data._id);
        expect(response.status).toBe(201);
      }else{
        expect(response.status).toBe(400)
      }
    }
  });

  it('Delete Permission', async () => {
    const permissionId =await Permission.findOne()
    const response = await supertest(app)
      .delete(`/api/v1/permissions/${permissionId._id}`)
      .set('authorization', TOKEN);
      expect(response.status).toBe(204);
    
  });
 
});