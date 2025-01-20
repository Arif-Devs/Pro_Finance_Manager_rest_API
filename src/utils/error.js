import User from "../model/user.js"
import Permission from "../model/permission.js"

const unAuthenticateError = (msg = 'Your Session May Have Expired!') => {
    const error = new Error(msg)
    error.status = 401
    return error
}

const notFoundError = (msg='Resource not found') => {
    const error = new Error(msg);
    error.status = 404;
    return error;
}

const serverError = (msg='Server Not Responding')=> {
    const error = new Error(msg)
    error.status = 500
    return error
}

const unAuthorizedError = (msg= 'Access Denied!')=>{
    const error = new Error(msg)
    error.status=403
    return error
}

const permissionRelationCheck = async(id)=>{
    const data = await Permission.findById(id).exec()
    if(!data) throw notFoundError('Permission id not found!')
}

const userRelationDataCheck = async(id)=>{
    const data = await User.findById(id).exec()
    if(!data) throw notFoundError('UserId not found!')

}

export {
    unAuthenticateError,
    serverError,
    notFoundError,
    unAuthorizedError,
    permissionRelationCheck,
    userRelationDataCheck
    
}