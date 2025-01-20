import tokenUtils from '../utils/token.js'
import { unAuthenticateError } from '../utils/error.js'


const authenticate = (req, res, next)=>{
   try {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      throw unAuthenticateError('Authorization header is missing.');
  }
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) throw unAuthenticateError('Authorization header is missing or invalid.')
      

    req.user = tokenUtils.verifyToken({token: token})
    next()
   } catch (error) {
    next(error)
   }
}

export default authenticate