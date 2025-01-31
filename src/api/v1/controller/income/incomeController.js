import { incomeLibs } from "../../../../libs/index.js";
import { expanseLibs } from "../../../../libs/index.js";

//create income
const create = async(req, res, next)=>{
    try {
        const {note, amount, accountId, userId, categoryId} = req.body
        await expanseLibs.checkRelationData(userId, categoryId, accountId, req.user._id)

        const {income} = await incomeLibs.createIncome({note, amount, accountId, userId, categoryId})

        const result = {
            code: 201,
            message: 'Income create success!',
            data:{
                ...income._doc
            }
        }
        return res.status(201).json(result)

    } catch (error) {
        next (error)
    }
}

export default {create}