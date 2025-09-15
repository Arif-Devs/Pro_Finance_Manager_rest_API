import User from "../../../../model/user.js";
import tokenDecode from "../../../../utils/token.js"
import { tokenLibs } from "../../../../libs/index.js";
import { notFoundError } from "../../../../utils/error.js";



const refresh = async (req,res,next) => {
  
   try {

   const {access_token} = req.body;
   const payload = tokenDecode.decodeJWT({token : access_token});

   const user = await User.findById(payload._id).exec();
   if(!user) throw notFoundError('User not Found!');

   // Generate Access & Refresh Token for User
   const {accessToken, refreshToken} = tokenLibs.generateAccess_RefreshToken({payload: {...user._doc, issuedIp : ip.address()}});

   // update refresh token
   await tokenLibs.createOrUpdateToken(user._id, refreshToken, ip.address())


   res.status(200).json({
    code: 200,
    message : 'Generate new Token Successfully!',
    accessToken,
   })

  } catch (error) {
       next(error) 
  }
}

export default refresh