import { authLibs, tokenLibs } from "../../../../libs/index.js";
import ip from 'ip'

const login = async (req, res, next)=>{
    
    try {
        const {userNameOrEmail} = req.body
        const user = await authLibs.loginUser(userNameOrEmail)
        const {accessToken, refreshToken} = tokenLibs.generateAccess_RefreshToken({payload: {...user._doc, issuedIp: ip.address()}})
        await tokenLibs.createOrUpdateToken(user._id, refreshToken, ip.address())
        
        const result = {
            code: 200,
            message: 'Login success',
            data:{
                ...user._doc,
                accessToken
            },
            
        }
        res.status(200).json(result)
       
    } catch (error) {
        next(error)
    }
}


export default login

