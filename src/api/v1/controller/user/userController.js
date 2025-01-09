import { UserLibs } from "../../../../libs/index.js";

const create = async(req, res, next)=>{
    try {
        const{userName, email, password,confirm_password,phone,roleId}= req.body

    const {user, accessToken}= await UserLibs.registerOrCreateUser({userName, email, password,confirm_password,phone,roleId})
    res.status(201).json({
        code: 201,
        message: "user has been created!",
        data:{
            ...user._doc,
            accessToken
        }
    })
    } catch (error) {
        next(error)
    }
}



export default {create}