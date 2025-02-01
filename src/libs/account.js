import { serverError } from "../utils/error.js";
import Account from "../model/account.js";
import { generateSelectedItems, generateSortType } from "../utils/query.js";


//create new account
const createAccount = async({name, accountDetails, initialValue, userId})=>{
    try {
        const account = new Account({
            name,
            accountDetails,
            initialValue,
            userId
        })
        await account.save()
        delete account._doc.id
        delete account._doc.__v
        return {account}
    } catch (error) {
        throw serverError(error.message)
    }
}


//get all accounts

const count= (data)=>{
    return Account.countDocuments(data)
}

const getAllData = async({search, sortBy ,sortType, limit, page, user, select, populate})=>{
    try {
        let sortTypeForDB = generateSortType(sortType)
        let selectedColumns = generateSelectedItems(select,['_id', 'name', 'accountDetails', 'userId', 'initialValue', 'createdAt', 'updatedAt'])
        let populateFields = generateSelectedItems(populate,['user', 'expanse', 'income'])

        let filter = {}
        if(search) filter.name = {$regex : search , $options : 'i'}
        if(user) filter.userId = user;

        let query = await Account.find(filter)
        .select(selectedColumns)
        .sort({[sortBy]: sortTypeForDB})
        .skip(page*limit-limit)
        .limit(limit)
        .populate(populateFields.includes('user')?{
            path : 'userId',
            select : 'userName, email, phone, roleId'
        }: '')

        let totalItems = await count(filter)

        return{
            query,
            totalItems
        }

    } catch (error) {
        
    }
}






export default {createAccount, getAllData}