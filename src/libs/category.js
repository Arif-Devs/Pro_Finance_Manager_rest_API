import Category from "../model/category.js";
import { serverError } from "../utils/error.js";
import {generateSlug} from '../utils/generate.js'
import { generateSortType } from "../utils/query.js";
import { notFoundError } from "../utils/error.js";
import Expanse from "../model/expanse.js";
import Income from "../model/income.js";

const createCategory = async(name)=>{
    try {
        const category = new Category()
        category.name = name
        category.slug = generateSlug(name)
        await category.save()
        return category._doc

    } catch (error) {
        throw serverError(error)
    }
}

const countCategory= (data)=>{
    return Category.countDocuments(data)
}

//get all data

const getAll = async({search, sortBy, sortType, limit, page})=>{
    try {
        const sortTypeForDB = generateSortType(sortType)
        
        const filter = {}
        if(search) filter.name = {$regex : search , $options : 'i'}

        const query = await Category.find(filter)
        .sort({[sortBy] : sortTypeForDB})
        .skip(page*limit-limit)
        .limit(limit)

        const totalItems = await countCategory(filter)

        return{
            query: query.length > 0 ? query : [],
            totalItems
        }

    } catch (error) {
        throw serverError(error)
    }
}

// Update or Create Category to DB
const updateByPut = async (id,name) => {
   try {
    let category = await Category.findById(id);
    let state;

    if(!category){
        const data = await Category.findOne({name}).exec();
        if(data) throw notFoundError('Category already exits!')
        category = new Category();
        category.name = name;
        category.slug = generateSlug(name);
        state = 'create'
    }else{
      category.name = name; 
      category.slug = generateSlug(name);
      state = 'update'
    }
    await category.save();
    return {category : category._doc , state};
   } catch (error) {
    throw serverError(error)
   }
}

// Delete Single Category by Id
const deleteById = async (id) => {
    try {
        const category = await Category.findOne({_id : id}).exec();
        if(!category) {
            throw notFoundError();
        }else if(category._doc.name === 'uncategorized'){
            throw notFoundError('This Category can not deleted!')
        }else{
        // update all income and expanse category to uncategorized
        await Expanse.updateMany({categoryId : id} , {categoryId : '64fb25f7088d859c8c08bcec'}).exec();
        await Income.updateMany({categoryId : id} , {categoryId : '64fb25f7088d859c8c08bcec'}).exec();

        await category.deleteOne()
        return true;
    }
    } catch (error) {
        throw notFoundError(error.message)
    }
};




export default {createCategory, getAll, updateByPut, deleteById}