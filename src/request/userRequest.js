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

const UpdatePatchRequestValidator = [
    body('username')
    .optional()
    .trim()
    .isAlphanumeric()
    .withMessage('Username must be a valid text format')
    .bail()
    .isLength({min: 5 , max:10})
    .withMessage('Username must be between 5-10 charecters')
    .custom(async (val , {req}) => {
        const user = await User.findOne({ username: val, _id: { $ne: req.params.id } })
        if(user) throw new Error('Username already exits!')
        return true
    })
    ,

    body('email')
    .optional()
    .isEmail().withMessage('Email must be an valid email')
    .custom(async (val, {req}) => {
        const user = await User.findOne({ email : val , _id : {$ne : req.params.id} });
        if (user) {
          return Promise.reject('Email is already registered');
        }
        return true;
    }),

    body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Phone must be an valid Phone Number!')
    .custom(async (val, {req}) => {
        const user = await User.findOne({ phone : val , _id : {$ne : req.params.id} });
        if (user) {
          return Promise.reject('Phone Number is already registered');
        }
        return true;
    }),

];

export default {createRequestValidator, UpdatePatchRequestValidator}