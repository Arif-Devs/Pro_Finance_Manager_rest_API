import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express';
const swaggerSpec = YAML.load('./docs/swagger.yaml');
import cors from 'cors'
import morgan from 'morgan'

dotenv.config();
const app = express();

const middleware = [cors(), morgan('dev'), express.json(), express.urlencoded({ extended: false })]

//Middleware
app.use(middleware)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



//Routs
app.use('/api/v1', router);



export default app;
