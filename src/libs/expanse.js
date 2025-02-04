import Expanse from "../model/expanse.js";
import { accountRelationDataCheck, userRelationDataCheck,categoryRelationDataCheck, serverError } from "../utils/error.js";

const checkRelationData = async(userId, categoryId, accountId, authUserId )=>{
    if(userId){
        await userRelationDataCheck(userId)
    }else{
        userId = authUserId
    }
    if(categoryId){
        await categoryRelationDataCheck(categoryId)
        
    } 
    if(accountId) {
        await accountRelationDataCheck(accountId)
        
    }
}


//create expanse
const createExpanse = async({amount, note, categoryId, accountId, userId})=>{
    try {
        const expanse = new Expanse({
            amount,
            note: note ?  note : '',
            categoryId,
            accountId,
            userId
        })

        await expanse.save()
        delete expanse._doc.id
        delete expanse._doc.__v
        return{expanse}
    } catch (error) {
        throw serverError(error.message)
    }
}

//get all expanse


export default {createExpanse, checkRelationData}