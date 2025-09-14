import User from "../../../../model/user.js";
import { notFoundError } from "../../../../utils/error.js";



const logout = async (req,res,next) => {
   try {
    const {id} = req.body;
    const user = await User.findById(id).exec();
    if(!user) throw notFoundError('User not Found!')

    user.refresh_token = ''
    user.issuedIp = ''
    await user.save();

    res.status(200).json({
        code : 200,
        message : 'Logout Completed Successfully!'
    })
   } catch (error) {
        next(error)
   }
}


export default logout