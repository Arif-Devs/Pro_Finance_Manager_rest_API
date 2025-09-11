import { expanseLibs } from "../../../../libs/index.js";
import Expanse from "../../../../model/expanse.js";
import {LIMIT, PAGE, SORTBY, SORTTYPE, SEARCH, SELECT, POPULATE, IDQUERY, MINPRICE, MAXPRICE } from "../../../../config/default.js"
import { generateAllDataHateoasLinks } from "../../../../utils/hateoas.js";
import generatePagination from "../../../../utils/pagination.js"
import transformMongooseDocs from "../../../../utils/response.js";
import { hasOwn } from "../../../../middleware/hasOwn.js";
import checkRelationData from "../../../../libs/expanse.js"


const create = async(req, res, next)=>{
 try {
    const {amount, note, categoryId, accountId, userId} = req.body
    console.log(typeof amount);
    
    await expanseLibs.checkRelationData(userId, categoryId, accountId, req.user._id)
    
    const {expanse} =await expanseLibs.createExpanse({amount, note, categoryId, accountId, userId})

    const result = {
        code: 201,
        message: "Expanse create success!",
        data:{
            ...expanse._doc
        }
    }
    return res.status(201).json(result)
 } catch (error) {
    next(error)
 }
}

//Get all expanse
const getAllExpanse = async(req, res, next)=>{
    
    try {
   
        let{limit, page, sortType, sortBy, search, user, select, populate, account, category, min_price, max_price, fromDate, toDate}= req.query;
        
        //default search params
        limit = +limit || LIMIT
        page = +page || PAGE
        sortBy = sortBy || SORTBY
        sortType = sortType || SORTTYPE
        search = search || SEARCH
        user = user || IDQUERY
        category = category || IDQUERY
        account = account || IDQUERY
        select = select || SELECT
        populate = populate || POPULATE
        min_price = min_price || MINPRICE
        max_price = max_price || MAXPRICE
        
        const {query, totalItems} =await expanseLibs.getAll({limit, page, sortType, sortBy, search, user, select, populate, account, category, min_price, max_price, fromDate, toDate})
        
        const totalPage = Math.ceil(totalItems / limit)

        const result = {
            code: 200,
            message: 'Data retrieved success!',
            data: query.length > 0 ? transformMongooseDocs(query, req.url) : [],
            links: generateAllDataHateoasLinks(query,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
            pagination: generatePagination(totalPage, page, totalItems, limit)

        } 
            
        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}


// Get Single Expanses 

const getById = async (req,res,next) => {
   try {
     const data = await Expanse.findById(req.params.id).exec();
    const hasPermit = hasOwn(req.permissions, data ? data._doc.userId.toString() : null , req.user);
    if(hasPermit){
        let {select,populate} = req.query;
        let {id} = req.params

        // set default search params   
        select  = select || SELECT
        populate = populate || POPULATE
    
        let expanse = await expanseLibs.getById({select,populate,id});
    
        // generate final responses data
        let result = {
            code : 200,
            message: 'Successfully data Retrieved!',
            data : {
                ...expanse,
                links : `${process.env.API_BASE_URL}${req.url}`,
            }
                
            
        }
    
        return res.status(200).json(result)
    }
    else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
   } catch (error) {
     next(error)
   }
}

// Update by patch
const updateByPatch = async (req,res,next) => {
    try {
        const data = await Expanse.findById(req.params.id).exec();
        const hasPermit = hasOwn(req.permissions, data ? data._doc.userId.toString() : null , req.user);
        if(hasPermit){
            const { id } = req.params;

            let {categoryId,userId,accountId,amount,note} = req.body

            await expanseLibs.checkRelationalData(userId,accountId,categoryId,req.user._id)

            const expanse = await expanseLibs.updateByPatch({id,categoryId,userId,accountId,amount,note})

            return res.status(200).json({
                code : 200,
                message : 'Expanse Updated Successfully!',
                data : {
                    ...expanse,
                }
            });
        }
        else{
            throw unAuthorizedError('You Do not have permit to modify or read other user data!');
        }
    } catch (error) {
        next(error)
    }
}

// Update or Create Expanse to DB
const updateByPut =async (req,res,next) => {
    try {
        const data = await Expanse.findById(req.params.id).exec();
        const hasPermit = hasOwn(req.permissions, data ? data._doc.userId.toString() : null , req.user);
    if(hasPermit){
        let {categoryId,userId,accountId,amount,note} = req.body;
        const {id} = req.params;

        await expanseLibs.checkRelationData(userId,accountId,categoryId,req.user._id)

        const {expanse, state} = await expanseLibs.updateByPut({id, categoryId,userId,accountId,amount,note})

        res.status(state === 'create' ? 201 : 200).json({
            code : state === 'create' ? 201 : 200,
            message : `Expanse ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
            data : {
                ...expanse,
            }
    })
    }
    else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
    } catch (error) {
        next(error)
    }
}


// Delete Single Expanse by Id
const deleteById = async (req,res,next) => {
   try {
        const data = await Expanse.findById(req.params.id).exec();
        const hasPermit = hasOwn(req.permissions, data ? data._doc.userId.toString() : null , req.user);
    if(hasPermit){
        const {id} = req.params;
        const isDeleted = await expanseLibs.deleteById(id);
        if(isDeleted){
            res.status(204).json({
                code : 204,
                message : 'Expanse Deleted Successfully!',
            })
        }
    }
    else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }

   } catch (error) {
        next(error)
   }
}



export  {create, getAllExpanse, getById, updateByPatch, updateByPut, deleteById}