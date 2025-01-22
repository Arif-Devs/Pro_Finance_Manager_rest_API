import { expanseLibs } from "../../../../libs/index.js";

const create = async(req, res, next)=>{
 try {
    const {amount, note, categoryId, accountId, userId} = req.body
    console.log(typeof amount);
    
    await expanseLibs.checkRelationData(userId, categoryId, accountId, req.user._id)
    
    const {expanse} =await expanseLibs.createExpanse({amount, note, categoryId, accountId, userId})

    const result = {
        code: 201,
        message: "Expanse create success!",
        data:{
            ...expanse._doc
        }
    }
    return res.status(201).json(result)
 } catch (error) {
    next(error)
 }
}


export default {create}