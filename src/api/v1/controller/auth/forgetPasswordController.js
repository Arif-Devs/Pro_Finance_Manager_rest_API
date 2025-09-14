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

export default verifyOwner