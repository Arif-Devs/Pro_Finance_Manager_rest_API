import { ACCESSTOKENLIFETIME, REFRESHTOKENLIFETIME } from "../config/auth.js";
import {serverError} from "../utils/error.js";
import tokenUtils from "../utils/token.js";

const generateAccess_RefreshToken = ({ payload }) => {
  try {
    const accessToken = tokenUtils.generateJWT({payload, expireIn: ACCESSTOKENLIFETIME});
    const refreshToken = tokenUtils.generateJWT({payload,expireIn: REFRESHTOKENLIFETIME});
    return { accessToken, refreshToken };
  } catch (error) {
    throw serverError(error);
  }
};

export default {generateAccess_RefreshToken} ;
