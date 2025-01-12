import { notFoundError, serverError } from "../utils/error.js"
import User from "../model/user.js"


const loginUser = async(userNameOrEmail = '')=>{
    try {
        const user = await User.findOne({$or: [{userName : userNameOrEmail }, {email: userNameOrEmail}]})
        if(!user) throw notFoundError()

            delete user._doc.password
            delete user._doc.refresh_token
            delete user._doc.verification_token
            delete user._doc.expiredAt
            delete user._doc.id
            delete user._doc.__v
            console.log('get data from auth libs : ',user);
            
            return user
        }catch (error) {
          throw serverError(error.message)
    }
}

        

export default {loginUser}