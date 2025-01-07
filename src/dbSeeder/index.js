import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import permissionSeeder from './permissionSeeder.js'
import roleSeeder from './roleSeeder.js'
import categorySeeder from './categorySeeder.js'
import userSeeder from './userSeeder.js'

const mode = process.env.TYPE;


// CONNECT WITH MONGODB USING MONGOOSE

const connectMongoDB = async () => {
    try {
        await mongoose.connect(
            mode === 'test'
                ? process.env.MONGOOSE_TEST_STRING
                : process.env.MONGOOSE_STRING,
            {
                
                serverSelectionTimeoutMS: 5000,
            }
        );
        console.log(`MongoDB Server Connected on HOST: ${mongoose.connection.host}`);

        await permissionSeeder();
        await roleSeeder();
        await categorySeeder();
        await userSeeder();

        console.log('All seed functions executed successfully.');
    } catch (error) {
        console.log(`${error}`);
    }
};

connectMongoDB()
