import { Schema, model } from 'mongoose';

const goalSchema = new Schema(
  {
    name: {
      require: true,
      type: String,
    },
    desired_date: {
      require: true,
      type: Date,
    },
    target_amount: {
      require: true,
      type: Number,
    },
    save_amount: {
      require: true,
      type: Number,
    },
    userId: {
      require: true,
      type: Schema.ObjectId,
      ref: 'User',
      unique: true,
    },
    note: {
      require: false,
      type: String,
    },
    status: {
      require: true,
      type: String,
      default: 'pending',
      enum: ['pending', 'complete'],
    },
  },{ timestamps: true });



const Goal = model('Goal', goalSchema);

export default Goal
