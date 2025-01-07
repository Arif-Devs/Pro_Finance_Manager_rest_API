import JWT from 'jsonwebtoken';
import {unAuthenticateError }from './error.js'
import ip from 'ip'
import { isAfter } from 'date-fns';
import dotenv from 'dotenv'
dotenv.config()


//Generate JWT token
const generateJWT = ({ payload, JWT_SECRET = process.env.JWT_SECRET, expireIn = "1h", algorithm = "HS256" }) => {
    const token = JWT.sign({ ...payload }, JWT_SECRET, { algorithm: algorithm }, expireIn)
    return token
}

// Verify JWT Token
const verifyToken = ({ JWT_SECRET = process.env.JWT_SECRET, token, algorithm = "HS256" }) => {
    try {
        const payload = JWT.verify(token, JWT_SECRET, { algorithms: [algorithm] })
        
        if (!isAfter(new Date(), payload.exp) && payload.issuedIp !== ip.address()) {
            throw unAuthenticateError('Invalid Token');
        } else {
            
            return payload;
        }
    } catch (error) {
        throw unAuthenticateError('Invalid Token')
    }
}

// decode JWT
const decodeJWT = ({ token, algorithm = "HS256" }) => {
    try {
        return JWT.decode(token, {algorithm: algorithm})
    } catch (error) {
        throw unAuthenticateError('Invalid Token')
    }
}

export default {
    generateJWT,
    verifyToken,
    decodeJWT
};