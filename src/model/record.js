import { Schema, model } from 'mongoose'

const recordSchema = new Schema({
    userId: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    totalIncome: {
        type: Number
    },
    totalExpanse: {
        type: Number
    },
    totalSaving: {
        type: Number
    },
    expanse_category: {
        type: String
    },
    state: {
        type: String,
        default: 'middle'
    }

}, { timestamps: true });



const Record = model('Record', recordSchema);

export default Record;