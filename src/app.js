import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();
const app = express();


//Routs
app.use('/api/v1', router);



export default app;
