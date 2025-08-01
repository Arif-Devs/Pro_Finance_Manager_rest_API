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

const countExpanse= (data)=>{
    return Expanse.countDocuments(data)
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

        const filter = {}
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
            filter.updatedAt = {}
            if(fromDate){
                filter.updatedAt.$gte = new Date(fromDate)
            }
            if(toDate){
                filter.updatedAt.$lte = new Date(toDate)
            }
        }

        const query = await Expanse.find(filter)
            .select(selectFields)
            .sort({[sortBy]: sortTypeForDB})
            .skip(page * limit - limit)
            .limit(limit)
            .populate(populateFields.includes('user')?{
                path: 'userId',
                select: 'userName, email, phone, roleId, createdAt, updatedAt'
            }: '')
            .populate(populateFields.includes('category')?{
                path: 'categoryId',
                select: 'name, slug, createdAt, updatedAt, _id'
            }: '')
            .populate(populateFields.includes('account')?{
                path : 'accountId',
                select: 'name, account_details, createdAt, updatedAt, _id'
            }: '')

            const totalItems = await countExpanse(filter)

            return{
                query,
                totalItems
            }
        
                
     } catch (error) {
        throw serverError(error) 
    }
}





export default {createExpanse, checkRelationData, getAll}