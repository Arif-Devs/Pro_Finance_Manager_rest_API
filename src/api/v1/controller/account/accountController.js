import { accountLibs } from "../../../../libs/index.js";
import { userRelationDataCheck } from "../../../../utils/error.js";
import {IDQUERY,LIMIT,PAGE,POPULATE,SEARCH,SELECT,SORTBY,SORTTYPE,} from "../../../../config/default.js";
import transformMongooseDocs from "../../../../utils/response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/hateoas.js";
import generatePagination from "../../../../utils/pagination.js";

//create account on db
const create = async(req, res, next)=>{
    
    try {
        const {name, accountDetails, initialValue, userId} = req.body
        
        if(userId){
            await userRelationDataCheck(userId)
        }else{
            userId = req.user._id
        }

        const {account} = await accountLibs.createAccount({name, accountDetails, initialValue, userId})
        const result = {
            code: 201,
            message: 'account create success!',
            data:{
                ...account._doc
            }
        }
        console.log(result);
        
        return res.status(201).json(result);
    }
     catch (error) {
        next(error)
    }
}

//get all account

const getAll = async(req, res, next)=>{
    try {
        const {search, sortBy ,sortType, limit, page, user, select, populate} = req.query

        limit = +limit || LIMIT
        page = +page || PAGE
        sortBy = sortBy || SORTBY
        sortType = sortType || SORTTYPE
        search = search || SEARCH
        user = user || IDQUERY
        select = select || SELECT
        populate = populate || POPULATE

        let {query, totalItems} = await accountLibs.getAllData({search, sortBy ,sortType, limit, page, user, select, populate})

        let totalPage = Math.ceil(totalItems/limit)

        let result = {
            code: 200,
            message: 'Data retrieved success!',
            data: query.length > 0 ? transformMongooseDocs(query, req.url) : [],
            links:generateAllDataHateoasLinks(query,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
            pagination: generatePagination(totalPage, page, totalItems, limit)

        }
        return res.status(200).json(result)
    } catch (error) {
        next(error.message)
    }
}

export  {create, getAll}