import { incomeLibs } from "../../../../libs/index.js";
import { expanseLibs } from "../../../../libs/index.js";
import {LIMIT, PAGE, SORTBY, SORTTYPE, SEARCH, SELECT, POPULATE, IDQUERY, MINPRICE, MAXPRICE } from "../../../../config/default.js"
import transformMongooseDocs from "../../../../utils/response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/hateoas.js";
import generatePagination from "../../../../utils/pagination.js";


//create income
const create = async(req, res, next)=>{
    try {
        const {note, amount, accountId, userId, categoryId} = req.body
        await expanseLibs.checkRelationData(userId, categoryId, accountId, req.user._id)

        const {income} = await incomeLibs.createIncome({note, amount, accountId, userId, categoryId})

        const result = {
            code: 201,
            message: 'Income create success!',
            data:{
                ...income._doc
            }
        }
        return res.status(201).json(result)

    } catch (error) {
        next (error)
    }
}

//get all incomes
const getAllIncome = async(req, res, next)=>{
    try {
        let {limit,page,sortType,sortBy,search,user,select,populate,account,category,min_price,max_price,fromDate,toDate} = req.query

        limit = +limit || LIMIT
        page = +page || PAGE
        sortBy = sortBy || SORTBY
        sortType = sortType || SORTTYPE
        search = search || SEARCH
        user = user || IDQUERY
        category = category || IDQUERY
        account = account || IDQUERY
        select  = select || SELECT
        populate = populate || POPULATE
        min_price = min_price || MINPRICE
        max_price = max_price || MAXPRICE

        let {income, totalItems} = await incomeLibs.getAll({limit,page,sortType,sortBy,search,user,select,populate,account,category,min_price,max_price,fromDate,toDate})

        let totalPage=Math.ceil(totalItems/limit)

        let result = {
            code: 200,
            message: "Data retrieved success",
            data: income.length > 0? transformMongooseDocs(income, req.url):[],
            links: generateAllDataHateoasLinks(income,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
            pagination: generatePagination(totalPage, page, totalItems,limit)

        }
        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
    
}

const getById = async (req,res,next) => {

    try {
        const data = await Income.findById(req.params.id).exec();
        const hasPermit = hasOwn(req.permissions, data ? data._doc.userId.toString() : null , req.user);
        if(hasPermit){
            let {select,populate} = req.query;
            let {id} = req.params
    
            // set default search params   
            select  = select || SELECT
            populate = populate || POPULATE
        
            let income = await incomeLibs.getById({select,populate,id});
        
            // generate final responses data
            let result = {
                code : 200,
                message: 'Successfully data Retrieved!',
                data  : {
                    ...income,
                    links : `${process.env.API_BASE_URL}${req.url}`,
                }
            }
            return res.status(200).json(result)
       
        }else{
            throw unAuthorizedError('You Do not have permit to modify or read other user data!')
        }
    } catch (error) {
        next(error)
    }
}

export  {create, getAllIncome, getById}