import User from "../model/user.js"
import Permission from "../model/permission.js"
import Account from "../model/account.js"
import Category from "../model/category.js"

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

const accountRelationDataCheck = async(id)=>{
    const data = await Account.findById(id).exec()
    if(!data) throw notFoundError('account not found')
}

const categoryRelationDataCheck= async(id)=>{
    const data = Category.findById(id).exec()
    if(!data) throw notFoundError('category not found')
}

const badRequestError = ({msg = 'Bad Request!' , errors = []}) => {
    const error = new Error(msg)
    error.status = 405
    error.errors = errors
    return error;
}

export {
    unAuthenticateError,
    serverError,
    notFoundError,
    unAuthorizedError,
    permissionRelationCheck,
    userRelationDataCheck,
    accountRelationDataCheck,
    categoryRelationDataCheck,
    badRequestError
    
}