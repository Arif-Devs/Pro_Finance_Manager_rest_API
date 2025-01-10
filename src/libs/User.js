import bcrypt from 'bcrypt'
import User from '../model/user.js'
import Role from '../model/role.js'
import { notFoundError, serverError } from '../utils/error.js'
import {tokenLibs} from './index.js'
import ip from 'ip'
import {DEFAULTPASS} from '../config/auth.js'
import { generateSelectedItems, generateSortType } from '../utils/query.js'


// Register or create new user
const registerOrCreateUser = async ({ userName, email, password, phone = '', roleId }) => {
    try {
        const hashPassword = await bcrypt.hash(password ? password : DEFAULTPASS, 10);
       
        // find role exists
        const userRole = await Role.findOne({ name: 'user' }).exec();
        if (!roleId && !userRole) {
            throw notFoundError('Please set a role or add a role named user')
        }
        // create user
        const user = new User({
            userName,
            email,
            phone,
            password: hashPassword,
            roleId: roleId ? roleId : userRole._doc._id,

        });

        // Generate access & refresh token 
        const ipAddress = ip.address()
        const tokens = tokenLibs.generateAccess_RefreshToken({ payload: { ...user. _doc, issuedIp: ipAddress}});
        
        user.refresh_token = tokens.refreshToken
        user.issuedIp = ipAddress;
        
        await user.save();
        
        return {user, accessToken: tokens.accessToken}
    } catch (error) {
        throw serverError(error.message)
    }
}

//Get all roles

const count= (data)=>{
    return User.countDocuments(data)
}

const getAllData = async({search, sortBy, sortType, limit, page, role, select, populate})=>{
    try {
    
        let sortTypeForDB = generateSortType(sortType);
        let selectedColumns = generateSelectedItems(select,['_id', 'userName', 'email', 'phone', 'roleId', 'createdAt','updatedAt']);
        let populateFields = generateSelectedItems(populate,['role', 'account', 'expanse', 'income', 'goal'])
       
        
        
        // Filter object for search and role
        let filter = {}
        if(search) filter.name = {$regex: search, $options: 'i'}
        if(role) filter.roleId = role
       
        let query = await User.find(filter)
        .select(selectedColumns)
        .sort({[sortBy]: sortTypeForDB})
        .skip(page*limit-limit)
        .limit(limit)
        .populate(populateFields.includes('role')?{
            path: 'roleId',
            select: 'name'
        }: '')
        
       

        //total count for pagination
        let totalItems = await count(filter)
        
        

        return{
            query,
            totalItems
        }
    } catch (error) {
        throw serverError(error)
    }

}

export default {registerOrCreateUser, getAllData}