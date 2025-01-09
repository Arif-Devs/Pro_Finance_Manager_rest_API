import { body } from "express-validator";
import User from "../model/user.js";

const isEmailUnique = async(email)=>{
    const existEmail = await User.findOne({email})
    if(existEmail){
        return Promise.reject('Email is already registered')
    }
}

const isPhoneUnique = async(phone)=>{
    const existPhone = await User.findOne({phone})
    if(existPhone){
        return Promise.reject('Phone number is already registered')
    }
}

const createRequestValidator = [
    body('userName')
    .trim()
    .isAlphanumeric()
    .withMessage('User name must be a valid text formate')
    .bail()
    .isLength({min: 5, max: 12})
    .withMessage('Username must be between 5-12 characters')
    .custom(async(value)=>{
        const userNameExist = await User.findOne({userName: value})
        if(userNameExist){
            throw new Error('User name exist')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('Enter valid email')
        .custom(isEmailUnique),
    
    body('phone')
        .optional()
        .isMobilePhone('any').withMessage('Enter valid phone number')
        .custom(isPhoneUnique),
    body('password')
        .optional()
        .trim()
        .isLength({ min: 6, max: 12 })
        .withMessage('Password must be between 5-10 characters')
        .bail()
        .isStrongPassword()
        .withMessage('Password must be strong'),
    body('confirm_password')
        .optional()
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password not match')
            }
        })

]

export default {createRequestValidator}