import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      require: true,
      type: String,
      unique: true,
    },
    slug: {
      require: true,
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category = model('Category', categorySchema);

export default Category;
