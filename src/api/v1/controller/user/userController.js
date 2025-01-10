import { UserLibs } from "../../../../libs/index.js";
import {IDQUERY, LIMIT, PAGE, POPULATE, SEARCH, SELECT, SORTBY, SORTTYPE} from '../../../../config/default.js'
import transformMongooseDocs from '../../../../utils/response.js'
import {generateAllDataHateoasLinks} from '../../../../utils/hateoas.js'
import generatePagination from '../../../../utils/pagination.js'

const create = async(req, res, next)=>{
    try {
        const{userName, email, password,confirm_password,phone,roleId}= req.body

    const {user, accessToken}= await UserLibs.registerOrCreateUser({userName, email, password,confirm_password,phone,roleId})
    res.status(201).json({
        code: 201,
        message: "user has been created!",
        data:{
            ...user._doc,
            accessToken
        }
    })
    } catch (error) {
        next(error)
    }
}

//get all

const getAll = async(req, res, next)=>{
    try {
    
        let {limit, page, sortType, sortBy, search, role, select, populate} = req.query

    //set default value
    limit = +limit || LIMIT
    page = +page || PAGE
    sortType = sortType || SORTTYPE
    sortBy = sortBy || SORTBY
    search = search || SEARCH
    role = role || IDQUERY
    select = select || SELECT
    populate = populate || POPULATE

    let{query, totalItems} = await UserLibs.getAllData({search, sortBy, sortType, limit, page, role, select, populate})

    // count total page
    let totalPage = Math.ceil(totalItems/limit)

    // send res to client
    let result = {
        code: 200,
        message: 'data retrieved success!',
        data: query.length > 0 ? transformMongooseDocs(query, req.url) : [],    
        links: generateAllDataHateoasLinks(query, req.url, req._parsedUrl.pathname, page, totalPage, req.query),
        pagination: generatePagination(totalPage, page, totalItems, limit)
        
        
    }
    return res.status(200).json({result})
    
} catch (error){
    next (error)
 }
}

export default {create, getAll}