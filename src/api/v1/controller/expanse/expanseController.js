import { expanseLibs } from "../../../../libs/index.js";
import {LIMIT, PAGE, SORTBY, SORTTYPE, SEARCH, SELECT, POPULATE, IDQUERY, MINPRICE, MAXPRICE } from "../../../../config/default.js"
import { generateAllDataHateoasLinks } from "../../../../utils/hateoas.js";
import generatePagination from "../../../../utils/pagination.js"
import transformMongooseDocs from "../../../../utils/response.js";


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


export  {create, getAllExpanse}