import { roleLibs } from '../../../../libs/index.js'
import {LIMIT,PAGE,SEARCH,SORTBY,SORTTYPE,} from "../../../../config/default.js";
import generatePagination from "../../../../utils/pagination.js";
import transformMongooseDocs from '../../../../utils/response.js';
import { generateAllDataHateoasLinks } from '../../../../utils/hateoas.js';

//create role
const create = async (req,res,next)=>{
    try {
        const {name,permissions} = req.body
        const {role,permission} = await roleLibs.create(name, permissions)
        res.status(201).json({
            code: 201,
            message: 'Role has been created!',
            data:{
                ...role,
                permissions:permission ? [...permission] : []
            }
        })
    } catch (error) {
        next(error)
    }
}

// Get All Roles according to filter from DB
const getAll = async (req,res,next) => {

   try {
    let {limit,page,sortType,sortBy,search} = req.query;

   // set default search params   
   limit = +limit || LIMIT
   page = +page || PAGE
   sortBy = sortBy || SORTBY
   sortType = sortType || SORTTYPE
   search = search || SEARCH


   let {updatedRoles , totalItems} = await roleLibs.getAll({search, sortBy ,sortType, limit , page});

   // count total Page
   let totalPage = Math.ceil(totalItems / limit)

   // generate final responses data
   let result = {
        code : 200,
        message: 'data retrieved success!',
        data  : updatedRoles.length > 0 ?  transformMongooseDocs(updatedRoles , req.url) : [], 
        links : generateAllDataHateoasLinks(updatedRoles,req.url,req._parsedUrl.pathname,page,totalPage,req.query),
        pagination : generatePagination(totalPage,page,totalItems,limit)
    }

    return res.status(200).json(result)
   } catch (error) {
        next(error)
   }
}

//update by patch

const updateByPatch = async (req,res,next) => {
    try {
        const { id } = req.params;
        const {name, permissions} = req.body;

        const {updatedRole , permissionsArray} = await roleLibs.updateByPatch(id,name,permissions)
        return res.status(200).json({
            code : 200,
            message : 'Role Updated Successfully!',
            data : {
                ...updatedRole._doc,
                permissions : permissionsArray
            }
        });
    } catch (error) {
        next(error)
    }
}

// Delete Single Role 
const deleteById = async (req,res,next) => {

  try {
    const {id} = req.params;
    const isDeleted = await RoleLibs.deleteById(id);
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Role & Associated Permissions are Deleted Successfully!',
        })
    }
  } catch (error) {
    next(error)
  }
}




export  {create, getAll, updateByPatch, deleteById}