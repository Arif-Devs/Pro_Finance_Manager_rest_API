import { Schema } from 'mongoose'

export const userSubSchema = new Schema({
    userName: {
        require: true,
        type: String,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: false
    },
    userId: {
        type: Schema.ObjectId,
        ref: 'User'
    }
})

export const globalSubSchema = new Schema({
    name: {
        require: true,
        type: String

    },
    desired_date: {
        require: true,
        type: Date
    },
    target_amount: {
        require: true,
        type: Number
    },
    saved_amount: {
        require: false,
        type: Number
    }
})

