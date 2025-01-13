import { ACCESSTOKENLIFETIME, REFRESHTOKENLIFETIME } from "../config/auth.js";
import {notFoundError, serverError} from "../utils/error.js";
import tokenUtils from "../utils/token.js";
import User from "../model/user.js";

// generate access and refresh token
const generateAccess_RefreshToken = ({ payload }) => {
  try {
    const accessToken = tokenUtils.generateJWT({payload, expireIn: ACCESSTOKENLIFETIME});
    const refreshToken = tokenUtils.generateJWT({payload,expireIn: REFRESHTOKENLIFETIME});
    return { accessToken, refreshToken };
  } catch (error) {
    throw serverError(error);
  }
};

// store the refresh token
const createOrUpdateToken = async(id, refreshToken, issuedIp)=>{
  try {
    const user =await User.findOne(id).exec()
    //update refresh token and issuedIp
    user.refresh_token = refreshToken
    user.issuedIp = issuedIp
    await user.save()
    
  } catch (error) {
    throw serverError(error)
  }
}




export default {generateAccess_RefreshToken, createOrUpdateToken} ;
