import Expanse from "../model/expanse.js";
import { accountRelationDataCheck, userRelationDataCheck,categoryRelationDataCheck, serverError } from "../utils/error.js";
import {generateSelectedItems, generateSortType} from '../utils/query.js'

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

const getAll = async({limit, page, sortType, sortBy, search, user, select, populate, account, category, min_price, max_price, fromDate, toDate})=>{
    try {
        const sortTypeForDB = generateSortType(sortType)
        const selectFields = generateSelectedItems(select['_id', 'amount', 'categoryId', 'userId','accountId', 'note', 'createdAt', 'updatedAt'])
        const populateFields = generateSelectedItems(populate['user', 'category', 'account'])

        let filter = {}
        if(search) filter.note = {$regex : search , $options : 'i'}
        if(user) filter.userId = user
        if(account) filter.accountId = account
        if(category) filter.categoryId = category

        if(min_price || max_price){
            filter.amount = {}
            if(min_price){
                filter.amount.$gte = min_price
            }
            if(max_price){
                filter.amount.$lte = max_price
            }
        }
        
        if(fromDate || toDate){
            filter.update = {}
            if(fromDate){
                filter.update.$gte = new Date(fromDate)
            }
            if(toDate){
                filter.update.$lte = new Date(toDate)
            }
        }







        
    } catch (error) {
        
    }
}


















export default {createExpanse, checkRelationData}