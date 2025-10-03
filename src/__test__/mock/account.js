import mongoose from "mongoose";

export const createValidAccountMock = {
    name: 'test account',
    accountDetails: 'test account details',
    initialValue: 0,
    userId: new mongoose.Types.ObjectId().toString()
}
export const updateValidAccountMock = {
    name: 'update account',
    accountDetails: 'test account details',
    initialValue: 0,
    userId: new mongoose.Types.ObjectId().toString()
}
export const createInvalidAccountMock = {
    name: '',
    accountDetails: '',
    initialValue: 0,
    userId: ''
}

