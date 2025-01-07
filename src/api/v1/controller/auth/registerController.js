import  {UserLibs}  from "../../../../libs/index.js";

const register = async (req, res, next) => {
    try {
        // request from body params
        const { userName, email, password, confirm_password, phone } = req.body
        // create user
        const { user, accessToken } = await UserLibs.registerOrCreateUser({ userName, email, password, confirm_password, phone })
        // send response
        res.status(200).json({
            code: 200,
            message: 'Registration Completed Successfully!',
            data: {
                ...user._doc,
                accessToken
            }
        })
    } catch (error) {
        next(error)
    }
}

export default {register};