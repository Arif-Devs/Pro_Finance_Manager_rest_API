import bcrypt from 'bcrypt';
import { body } from "express-validator";
import User from '../model/user.js';

//validation check for email
const isEmailUnique = async (email) => {
    const emailExist = await User.findOne({ email })
    if (emailExist) {
        return Promise.reject('Email is already exist')
    }
};

//validation check for phone

const isPhoneUnique = async (phone) => {
    const phoneExist = await User.findOne({ phone })
    if (phoneExist) {
        return Promise.reject('Phone Number is already registered')
    }
};

// check input valid user name

const isUserName = (value) => {
    return /^[a-zA-Z0-9_]+$/.test(value);
}

const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

//sign request body validator

const registerRequestValidator = [
    body('userName')
        .trim()
        .isAlphanumeric()
        .withMessage('Username must be a valid text format')
        .bail()
        .isLength({ min: 5, max: 10 })
        .withMessage('Username must be between 5-10 characters')
        .custom(async value => {
            const userExist = await User.findOne({ userName: value })
            if (userExist) {
                throw new Error('User name already exist')
            }
        }),
    body('email')
        .isEmail().withMessage('Enter valid email')
        .custom(isEmailUnique),
    body('phone')
        .isMobilePhone('any').withMessage('Enter valid phone number')
        .custom(isPhoneUnique),
    body('password')
        .trim()
        .isLength({ min: 6, max: 12 })
        .withMessage('Password must be between 5-10 characters')
        .bail()
        .isStrongPassword()
        .withMessage('Password is not strong enough'),
    body('confirm_password')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password not match')
            }
            return true
        })
];

const loginRequestValidator = [
    body('userNameOrEmail')
    .trim()
    .custom(async(val)=>{
        if(!val || !(isUserName() || isEmail())){
            throw new Error('Invalid credential!')
        }
        return true
    }).bail(),
    body('password')
    .trim()
    .custom(async(val, {req})=>{
        const user = await User.findOne({
            $or: [{userName: req.body.userNameOrEmail}, {email: req.body.userNameOrEmail}]
        })
        if(!user){
            return Promise.reject('Invalid credential!')
        }
       
        const hashpass = await bcrypt.compare(val, user.password)
        if(!hashpass){
            throw new Error('Invalid credential!')
        }
        return true
    }),
]


const resetRequestValidator = [
    body('password')
    .trim()
    .isLength({min: 6, max:12})
    .withMessage('Password must be between 5-10 characters')
    .bail()
    .isStrongPassword()
    .withMessage('Password must be strong'),

    body('confirm_password')
    .trim()
    .custom((val,{req}) => {
        if(val !== req.body.password) throw new Error('Password not match')
        return true;
    }),
];



export default {registerRequestValidator, loginRequestValidator, resetRequestValidator};