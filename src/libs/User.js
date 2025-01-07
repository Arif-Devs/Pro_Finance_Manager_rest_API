import bcrypt from 'bcrypt'
import User from '../model/user.js'
import Role from '../model/role.js'
import { notFoundError, serverError } from '../utils/error.js'
import {tokenLibs} from './index.js'
import ip from 'ip'
import {DEFAULTPASS} from '../config/auth.js'


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

export default {registerOrCreateUser}