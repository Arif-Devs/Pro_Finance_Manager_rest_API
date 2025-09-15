import { UserLibs } from "../../../../libs/index.js";
import { generateUniqueCode } from "../../../../utils/generate.js";
import { sendEmailForEmailVerify } from "../../../../utils/mail.js";


const verifyOwner = async (req,res,next) => {
    try {
       const OTP = generateUniqueCode();

       const {usernameOrEmail} = req.body
 
       const user = await UserLibs.updateToken(usernameOrEmail,OTP)
 
       const isSend = await sendEmailForEmailVerify(user.email,user.userName,user._id,OTP)

       if(!isSend) return res.status(500).json({message : 'Email can not be delivered! we are sorry!'})
 
       res.status(200).json({
         code : 200,
         message : 'Check your inbox for verification',
       })
    } catch (err) {
       const error = new Error(err) 
       error.status = 500
       next(error)
    }
 }


 const verifyResetLink = async (req,res,next) => {
   try {
     const {id, token} = req.params;
     const user = await TokenLibs.verifyToken(id, token)
     res.status(200).json({
      code : 200,
      message : 'Verification Pass Successfully!'
     })

   } catch (error) {
      next(error)
   }
 }


 const resetPassword = async (req,res,next) => {
   try {
     const {id,token} = req.params;
     const {password} = req.body;

     const user = await TokenLibs.verifyToken(id, token);
   
     const hasPassword = await bcrypt.hash(password, 10);
     user.password = hasPassword;
     user.refresh_token = '';
     user.issuedIp = '';
     await user.save();
   
     res.status(200).json({
      code : 200,
      message : 'Password Reset Successfully!'
     })
   } catch (error) {
      next(error)
   }
 }


 

export  {verifyOwner, verifyResetLink, resetPassword}