import Category from "../model/category.js";
import { serverError } from "../utils/error.js";
import generateSlug from '../utils/generate.js'
import { generateSortType } from "../utils/query.js";

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



export default {createCategory, getAll}