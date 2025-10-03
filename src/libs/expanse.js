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
        let sortTypeForDB = generateSortType(sortType)
        let selectFields = generateSelectedItems(select, ['_id', 'amount', 'categoryId', 'userId','accountId', 'note', 'createdAt', 'updatedAt'])
        let populateFields = generateSelectedItems(populate, ['user', 'category', 'account'])

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

        let query = await Expanse.find(filter)
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

            let totalItems = await countExpanse(filter)

            return{
                query,
                totalItems
            }
        
                
     } catch (error) {
        throw serverError(error) 
    }
}


// get Single Item
const getById = async ({select,populate,id}) => {
    try {
        let selectFields = generateSelectedItems(select,['_id','amount','categoryId','userId','accountId', 'note' ,'createdAt' , 'updatedAt']);

        let populateRelations = generateSelectedItems(populate,['user','category','account']);
        
        
        // send request to db with all query params
        let expanse = await Expanse.findById(id)
        .select(selectFields)
        .populate(populateRelations.includes('user') ? {
            path   : 'userId',
            select : 'username , email , phone , roleId,createdAt , updatedAt , _id',
        } : '')
        .populate(populateRelations.includes('category') ? {
            path   : 'categoryId',
            select : 'name , slug , createdAt , updatedAt , _id',
        } : '')
        .populate(populateRelations.includes('account') ? {
            path   : 'accountId',
            select : 'name , account_details createdAt , updatedAt , _id',
        } : '')

        if(expanse){
            return expanse._doc
        }else{
            throw notFoundError()
        }
    } catch (error) {
        throw serverError(error)
    }

}

//update by patch

const updateByPatch = async ({id,categoryId,userId,accountId,amount,note}) => {

    try {
        const expanse = await Expanse.findById(id).exec();
        if(!expanse) throw new Error('Expanse Not Found!')

        expanse.amount = amount ? amount : expanse.amount;
        expanse.accountId = accountId ? accountId : expanse.accountId;
        expanse.categoryId = categoryId ? categoryId : expanse.categoryId;
        expanse.userId = userId ? userId : expanse.userId;
        expanse.note = note ? note : expanse.note;
        await expanse.save();

        delete expanse._doc.id
        delete expanse._doc.__v
        return expanse._doc
    } catch (error) {
        throw serverError(error)
    }
}

//update by put
const updateByPut = async ({id, categoryId,userId,accountId,amount,note}) => {
    try {
        const expanse = await Expanse.findById(id).exec();

        if(!expanse) {
        const {expanse} =  await createExpanse({amount, note, categoryId, accountId, userId})
            return {
                expanse : expanse._doc, 
                state : 'create'
            }
        }else{
            expanse.amount = amount ? amount : expanse.amount;
            expanse.accountId = accountId ? accountId : expanse.accountId;
            expanse.categoryId = categoryId ? categoryId : expanse.categoryId;
            expanse.userId = userId ? userId : expanse.userId;
            expanse.note = note ? note : expanse.note;
            await expanse.save();

            return {
                expanse : expanse._doc,
                state : 'update'
            }
        } 
    } catch (error) {
        throw serverError(error)
    } 
}


//delete expanse
const deleteById = async (id) => {
    try {
        const expanse = await Expanse.findOne({_id : id}).exec();
        if(!expanse) {
            throw notFoundError();
        }else{
            
            await expanse.deleteOne()
            return true;
        }
    } catch (error) {
        throw serverError(error)
    }
};


export default {createExpanse, checkRelationData, getAll, getById, updateByPatch, updateByPut, deleteById}