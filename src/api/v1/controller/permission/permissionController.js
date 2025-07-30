import {permissionLibs} from '../../../../libs/index.js'
import {LIMIT,PAGE,SEARCH,SORTBY,SORTTYPE,} from "../../../../config/default.js";
import transformMongooseDocs from '../../../../utils/response.js';

//Create permission
const create = async (req, res, next)=>{
    const {name} = req.body
    const permission = await permissionLibs.createPermission(name)

    // Send response to user
    res.status(201).json({
        code:201,
        message:"Permission has been created!",
        data: {...permission}
    })
}

const getAll = async (req,res,next) => {
   
    let {limit,page,sortType,sortBy,search} = req.query;

   // set default search params   
   limit = +limit || LIMIT
   page = +page || PAGE
   sortBy = sortBy || SORTBY
   sortType = sortType || SORTTYPE
   search = search || SEARCH

   let {query , totalItems} = await permissionLibs.getAll({search, sortBy ,sortType, limit , page});

   // count total Page
   let totalPage = Math.ceil(totalItems / limit)

   // generate final responses data
   let result = {
        code : 200,
        message: 'Successfully data Retrieved!',
        data  : query.length > 0 ?  transformMongooseDocs(query , req.url) : [], 
        links : generateAllDataHateoasLinks(query,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
        pagination : generatePagination(totalPage,page,totalItems,limit)
    }

    return res.status(200).json(result)
}


export  {create, getAll}