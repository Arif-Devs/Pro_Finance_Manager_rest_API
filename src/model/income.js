import { Schema, model } from 'mongoose';

const incomeSchema = new Schema(
  {
    note: {
      require: false,
      type: String,
    },
    amount: {
      require: true,
      type: Number,
    },
    userId: {
      require: true,
      type: Schema.ObjectId,
      ref:'User'
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



const Income = model('Income', incomeSchema);

export default Income;
