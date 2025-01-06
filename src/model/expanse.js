import { Schema, model } from 'mongoose';

const expanseSchema = new Schema(
  {
    note: {
      require: true,
      type: String,
    },
    amount: {
      require: true,
      type: Number,
    },
    userId: {
      require: true,
      type: Schema.ObjectId,
      ref: 'User',
    },
    categoryId: {
      require: true,
      type: Schema.ObjectId,
      ref: 'Category',
    },
    accountId: {
      require: true,
      type: Schema.ObjectId,
      ref: 'Account',
    },
  },{ timestamps: true });



const Expanse = model('Expanse', expanseSchema);


export default Expanse;
