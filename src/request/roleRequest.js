import { body } from "express-validator";
import Role from '../model/role.js'
import mongoose from "mongoose";

//sign request body validator

const roleCreateRequest = [
    body('name')
    .trim()
    .custom(async(roleName)=>{
        const role = await Role.findOne({name: roleName})
        if(role){
            return Promise.reject('Role is already added')
        }
    }),

    body('permissions')
    .optional()
    .isArray()
    .withMessage('must be a array with objectid')
    .bail()
    .custom(async(permissionId)=>{
        if(permissionId.length>0){
            return permissionId.every(item=> mongoose.Types.ObjectId.isValid(mongoose.Types.ObjectId.createFromHexString(item)))
        }
        return true
    })
]

// Sign Request Body Validator
const roleUpdateRequest  = [
    body('name')
    .trim()
    .custom(async (val , {req}) => {
        const role = await Role.findOne({ name: val, _id: { $ne: req.params.id } });
        if (role) {
            return Promise.reject('Role is already Added!');
        }

        return true
    }),

    body('permissions')
    .optional()
    .isArray()
    .withMessage('Must Be an Array with ObjectId!')
    .bail()
    .custom(val => {
        if (val.length > 0) {
            return val.every(item => mongoose.Types.ObjectId.isValid(mongoose.Types.ObjectId.createFromHexString(item)));
        }
        return true;
    })
];


export default {roleCreateRequest, roleUpdateRequest}


