import {serverError} from '../utils/error.js'
import Income from '../model/income.js'
const createIncome = async({note, amount, accountId, userId, categoryId})=>{
    try {
        const income = new Income({
            amount,
            note : note ? note : '',
            accountId,
            userId,
            categoryId
        })
        await income.save()
        delete income._doc.id
        delete income._doc.__v
        return{income}
    } catch (error) {
        throw serverError(error.message)
    }
}

export default {createIncome}