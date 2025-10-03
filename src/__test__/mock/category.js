import mongoose from "mongoose"

export const createCategoryMock = {
    name : 'categoryTest',
    categoryId : new mongoose.Types.ObjectId().toString()
}

export const updateCategoryMock = {
    name : 'updated category'
}