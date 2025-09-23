import { UserLibs } from "../../../../libs/index.js";
import {IDQUERY,LIMIT,PAGE,POPULATE,SEARCH,SELECT,SORTBY,SORTTYPE,} from "../../../../config/default.js";
import transformMongooseDocs from "../../../../utils/response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/hateoas.js";
import generatePagination from "../../../../utils/pagination.js";
import { serverError, unAuthorizedError } from "../../../../utils/error.js";
import { hasOwn } from "../../../../middleware/index.js";
import User from "../../../../model/user.js";

const create = async (req, res, next) => {
  try {
    const { userName, email, password, confirm_password, phone, roleId } = req.body;

    const { user, accessToken } = await UserLibs.registerOrCreateUser({
      userName,
      email,
      password,
      confirm_password,
      phone,
      roleId,
    });
    res.status(201).json({
      code: 201,
      message: "user has been created!",
      data: {
        ...user._doc,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

//get all Data

const getAll = async (req, res, next) => {
  try {
    let { limit, page, sortType, sortBy, search, role, select, populate } =
      req.query;

    //set default value
    limit = +limit || LIMIT;
    page = +page || PAGE;
    sortType = sortType || SORTTYPE;
    sortBy = sortBy || SORTBY;
    search = search || SEARCH;
    role = role || IDQUERY;
    select = select || SELECT;
    populate = populate || POPULATE;

    let { query, totalItems } = await UserLibs.getAllData({search,sortBy,sortType,limit,page,role,select,populate});

    // count total page
    let totalPage = Math.ceil(totalItems / limit);

    // send res to client
    let result = {
      code: 200,
      message: "data retrieved success!",
      data: query.length > 0 ? transformMongooseDocs(query, req.url) : [],
      links: generateAllDataHateoasLinks(
        query,
        req.url,
        req._parsedUrl.pathname,
        page,
        totalPage,
        req.query
      ),
      pagination: generatePagination(totalPage, page, totalItems, limit),
    };
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

//get single data

const getUserById = async (req, res, next) => {
  try {
    const hasPermission = hasOwn(req.permissions, req.params.id, req.user);
    
    // check the user has the right permission
    if (!hasPermission) {
      throw unAuthorizedError(
        "you do not have permission to modify or read other user data"
      );
    } else {
      let { select, populate } = req.query;
      let { id } = req.params;

      // set default search params
      select = select || SELECT;
      populate = populate || POPULATE;

      //fetch user data from database
      const user = await UserLibs.getSingleById({ select, populate, id });

      //send response
      const result = {
        code: 200,
        message: "data retrieve success!",
        data: {
          ...user,
          links: `${process.env.API_BASE_URL}${req.url}`,
        },
      };
      return res.status(200).json(result);
    }
  } catch (error) {
    next(error)
  }
};

//Update user patch

const updateUserByPatch = async(req, res, next)=>{
  try {
    const hasPermission = hasOwn(req.permissions, req.params.id, req.user)

    if(hasPermission){
      const {id} = req.params
      const {userName, email, phone, roleId} = req.body

      const user = await UserLibs.updateByPatch(id, userName, email, phone, roleId)
      
      const result = {
        code: 200,
        message: "user update success",
        data:{
          ...user
        }

      }
      return res.status(200).json(result)

    } else{
      throw unAuthorizedError('You do not have right permission to change any data')
    }
  } catch (error) {
    next(error)
  }
}

//Update by put
  const updateByPut = async (req,res,next) => {

    try {
      const hasPermit = hasOwn(req.permissions, req.params.id , req.user);
    if(hasPermit){
        const {username,email,phone,roleId,password,confirm_password} = req.body;
        const {id} = req.params;
        const {user , accessToken , state} = await UserLibs.updateByPUT(id,username,email,phone,roleId,password,confirm_password)

        const result = state === 'create' ? {...user, accessToken} : {...user}

        res.status(state === 'create' ? 201 : 200).json({
            code : state === 'create' ? 201 : 200,
            message : `User ${state == 'create' ? 'Created' : 'Updated'} Successfully!`,
            data : {
                ...result,
            }
        })
    }else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
    } catch (error) {
      next(error)
    }
    
}

const deleteById = async (req,res,next) => { 

  try {
      const hasPermit = hasOwn(req.permissions, req.params.id , req.user);
      if(hasPermit){
      const {id} = req.params;
      const isDeleted = await UserLibs.deleteById(id);
      if(isDeleted){
          res.status(204).json({
              code : 204,
              message : 'User Deleted Successfully!',
          })
      }
  }else{
    throw unAuthorizedError('You Do not have permit to modify or read other user data!');
  }
    } catch (error) {
      next(error)
    }
    
};

const resetPassword = async (req,res,next) => {
   try {
    const hasPermit = hasOwn(req.permissions, req.params.id , req.user);
    if(hasPermit){
        const user = await User.findById(req.params.id).exec();
        const hash = await bcrypt.hash(req.body.password , 10);
        user.password =  hash;
        user.refresh_token = ''
        user.issuedIp = ''
        await user.save();

        res.status(200).json({
            code : 200,
            message : 'Password Reset Successfully Login Again!'
        })
    }else{
        throw unAuthorizedError('You Do not have permit to modify or read other user data!');
    }
   } catch (error) {
      next(error)
   }

}


export { create, getAll, getUserById, updateUserByPatch, updateByPut, deleteById, resetPassword };
