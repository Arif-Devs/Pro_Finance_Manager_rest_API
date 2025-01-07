import { body } from "express-validator";
import Permission from "../model/permission.js";

//Sign request body validator

const permissionCreateRequest = [
    body('name')
    .trim()
    .notEmpty()
    .bail()
    .isLength({min: 3, max: 20})
    .withMessage("Permission name must be between 3 and 2 characters")
    .bail()
    .isString()
    .bail()
    .custom(async(permissionName)=>{
        // check if permission already exist
        const existPermissionName =  await Permission.findOne({name: permissionName})
        if(existPermissionName){
            return Promise.reject("Same permission name already exist.")
        }
        return true
    })


]


export default {permissionCreateRequest}