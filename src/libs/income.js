import {serverError} from '../utils/error.js'
import Income from '../model/income.js'
import { generateSelectedItems, generateSortType } from '../utils/query.js'




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

const countIncome= (data)=>{
    return Income.countDocuments(data)
}

//get all income
const getAll = async({limit, page, sortType, sortBy, search, user, select, populate, account, category, min_price, max_price, fromDate, toDate}) =>{

try {
    let sortTypeForDB = generateSortType(sortType);
    let selectFields = generateSelectedItems(select,['_id','amount','categoryId','userId','accountId', 'note' ,'createdAt' , 'updatedAt'])
    let populateFields = generateSelectedItems(populate,['user', 'category', 'account'])

    let filter = {}
    if(search) filter.note = {$regex : search , $options : 'i'}
    if(user) filter.userId = user
    if(account) filter.accountId = account
    if(category) filter.categoryId = category

     if (min_price || max_price) {
        filter.amount = {};   
        if (min_price) {
          filter.amount.$gte = min_price;
        }
      
        if (max_price) {
          filter.amount.$lte = max_price;
        }
      }
      if(fromDate || toDate){
        filter.updatedAt = {}
        if(fromDate) filter.updatedAt.$gte = new Date(fromDate)
        if(toDate) filter.updatedAt.$lte = new Date(toDate)
      }
     let income = await Income.find(filter)
        .select(selectFields)
        .sort({[sortBy] : sortTypeForDB})
        .skip(page * limit - limit)
        .limit(limit)
        .populate(populateFields.includes('user') ? {
            path   : 'userId',
            select : 'username , email , phone , roleId, createdAt , updatedAt',
        } : '')
        .populate(populateFields.includes('category') ? {
            path   : 'categoryId',
            select : 'name , slug , createdAt , updatedAt , _id',
        } : '')
        .populate(populateFields.includes('account') ? {
            path   : 'accountId',
            select : 'name , account_details createdAt , updatedAt , _id',
        } : '')
        
        
        let totalItems = await countIncome(filter) ;

        return {
            income,
            totalItems
        }

    } catch (error) {
        throw serverError(error.message)
    }
}

// get Single Item
const getById = async ({select,populate,id}) => {
    try {
        let selectFields = generateSelectedItems(select,['_id','amount','categoryId','userId','accountId', 'note' ,'createdAt' , 'updatedAt']);

        let populateRelations = generateSelectedItems(populate,['user','category','account']);
    
        
        let income = await Income.findById(id)
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

        if(income){
            return income._doc
        }else{
            throw notFoundError()
        }
    } catch (error) {
        throw serverError(error)
    }


}

// Update patch
const updateByPatch = async ({id, categoryId, userId, accountId, amount, note}) => {
    try {   
        const income = await Income.findById(id).exec();
        if(!income) throw new Error('Income Not Found!')

        income.amount = amount ? amount : income.amount;
        income.accountId = accountId ? accountId : income.accountId;
        income.categoryId = categoryId ? categoryId : income.categoryId;
        income.userId = userId ? userId : income.userId;
        income.note = note ? note : income.note;
        await income.save();

        delete income._doc.id
        delete income._doc.__v
        return income._doc
    } catch (error) {
        throw serverError(error)
    }
}



// Update by put
const updateByPut = async ({id, categoryId,userId,accountId,amount,note}) => {
    try {
        const income = await Income.findById(id).exec();
        if(!income) {
        const {income} =  await createIncome({categoryId,userId,accountId,amount,note})
            return {
                income : income._doc, 
                state : 'create'
            }
        }else{
            income.amount = amount ? amount : income.amount;
            income.accountId = accountId ? accountId : income.accountId;
            income.categoryId = categoryId ? categoryId : income.categoryId;
            income.userId = userId ? userId : income.userId;
            income.note = note ? note : income.note;
            await income.save();

            return {
                income : income._doc,
                state : 'update'
            }
        }
    } catch (error) {
        throw serverError(error)
    }  
}



// Delete 
const deleteById = async (id) => {
    try {
        const income = await Income.findOne({_id : id}).exec();
        if(!income) {
            throw notFoundError();
        }else{
            await income.deleteOne()
            return true;
        }
    } catch (error) {
       throw serverError(error) 
    }
};


export default {createIncome, getAll, getById, updateByPatch, updateByPut, deleteById}