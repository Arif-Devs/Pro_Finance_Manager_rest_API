import { serverError } from "../utils/error.js";
import Account from "../model/account.js";
import { generateSelectedItems, generateSortType } from "../utils/query.js";
import Expanse from "../model/expanse.js";
import Income from "../model/income.js";



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


// get Single Item
const getById = async ({select,populate,id}) => {
   try {
    let selectedColumns = generateSelectedItems(select,['_id','name','account_details','initial_value','userId','createdAt' , 'updatedAt']);

    let populateRelations = generateSelectedItems(populate,['expanse','income','user']);
    

    // send request to db with all query params
    let account = await Account.findById(id)
    .select(selectedColumns)
    .populate(populateRelations.includes('user') ? {
        path   : 'userId',
        select : 'username , email , phone , roleId, createdAt , updatedAt , _id',
    } : '');

    account = account._doc;

    if(populateRelations.includes('expanse')){
        let expanses = await Expanse.find({accountId : id}).exec();
        account = {...account, expanses}
    }
    if(populateRelations.includes('income')){
        let incomes = await Income.find({accountId : id}).exec();
        account = {...account , incomes}
    }

    if(account){
        return account
    }else{
        throw notFoundError()
    }
   } catch (error) {
    throw serverError(error)
   }
}


// Update Single User Via PATCH Request
const updateByPatch = async (id,name,accountDetails,initialValue,userId) => {
   try {
        const account = await Account.findById(id).exec();
        if(!account) throw new Error('Account Not Found!')

        account.name = name ? name : account.name;
        account.accountDetails = accountDetails ? accountDetails : account.accountDetails;
        account.initialValue = initialValue ? initialValue : account.initialValue;
        account.userId = userId ? userId : account.userId;
        await account.save();

        
        delete account._doc.id
        delete account._doc.__v
        return account._doc
   } catch (error) {
        throw serverError(error)
   }
}



export default {createAccount, getAllData, getById, updateByPatch}