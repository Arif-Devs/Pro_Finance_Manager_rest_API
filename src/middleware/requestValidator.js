import { validationResult } from "express-validator";

// Middleware to validate incoming requests and format errors for 400 responses

export const requestValidator=(req, res, next)=>{
   try {
    const validationError = validationResult(req).formatWith((error)=>{
        return{
            fieldName: error.path,
            errorMessage: error.msg
        }
    })
    
    if(!validationError.isEmpty()){
        return res.status(400).json({
            statusCode: 400,
            statusMessage: "Bad Request!",
            errorDetails: validationError.array()
        })
    }

    next()
   } catch (error) {
    next(error)
   }
}

