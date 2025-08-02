import { categoryLibs } from "../../../../libs/index.js";
import {LIMIT,PAGE,SEARCH,SORTBY,SORTTYPE,} from "../../../../config/default.js";
import transformMongooseDocs from "../../../../utils/response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/hateoas.js";
import generatePagination from "../../../../utils/pagination.js";


const create = async(req, res, next)=>{
    try {
    const {name} = req.body
    const category = await categoryLibs.createCategory(name)

    const result = {
        code: 201,
        message: 'Category create success!',
        data:{
            ...category
        }
    }
    return res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

//get all data
 const getAllCategories = async(req, res, next)=>{
    try {
        let {search, sortBy, sortType, limit, page} = req.query;

        limit = +limit || LIMIT
        page = +page || PAGE
        sortBy = sortBy || SORTBY
        sortType = sortType || SORTTYPE
        search = search || SEARCH
        
        const {query, totalItems} = await categoryLibs.getAll({search, sortBy, sortType, limit, page})

        const totalPage = Math.ceil(totalItems/limit)

        const result = {
            code: 200,
            message: 'Data retrieved success!',
            data: query.length > 0 ?  transformMongooseDocs(query, req.url) : [],
            links: generateAllDataHateoasLinks(query,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
            pagination: generatePagination(totalPage, totalItems,page, limit)

        }
        return res.status(200).json(result)
        
    } catch (error) {
        next(error.message)
    }
 } 

 // Update or Create Category to DB
const updateByPut = async (req,res,next) => {
   try {
    const {name} = req.body;
    const {id} = req.params;
    const {category , state} = await categoryLibs.updateByPut(id,name)

    res.status(state === 'create' ? 201 : 200).json({
        code : state === 'create' ? 201 : 200,
        message : `Category ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
        data : {...category}
    })
   } catch (error) {
        next(error)
   }
}


// Delete Single Category by Id
const deleteById = async (req,res,next) => {
    try {
    const {id} = req.params;
    const isDeleted = await categoryLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Category Deleted Successfully!',
        })
    }
    } catch (error) {
        next(error)
    }
}



// Delete Multiple Category by Id
const bulkDelete = async (req,res,next) => {
   try {
    const {id} = req.params;
    const isDeleted = await categoryLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Category Deleted Successfully!',
        })
    }
   } catch (error) {
     next(error)
   }
}



export {create, getAllCategories, updateByPut, deleteById, bulkDelete}