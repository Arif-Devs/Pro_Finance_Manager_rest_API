import Category from "../model/category.js";
import { serverError } from "../utils/error.js";
import generateSlug from '../utils/generate.js'

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




export default {createCategory}