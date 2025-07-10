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

export default {create, getAllIncome}