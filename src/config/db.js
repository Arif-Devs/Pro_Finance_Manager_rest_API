import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mode = process.env.TYPE;

// Connect mongodb with mongoose

const connectMongoDB = async () => {
  try {
    let connect = await mongoose.connect(
      mode === 'test'
        ? process.env.MONGOOSE_TEST_STRING
        : process.env.MONGOOSE_STRING,
     
    );
    console.log(`MongoDB server Connected on PORT ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`${error}`);
  }
};

export default connectMongoDB;
