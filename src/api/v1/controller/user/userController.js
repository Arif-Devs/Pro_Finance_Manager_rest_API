import { UserLibs } from "../../../../libs/index.js";
import {IDQUERY,LIMIT,PAGE,POPULATE,SEARCH,SELECT,SORTBY,SORTTYPE,} from "../../../../config/default.js";
import transformMongooseDocs from "../../../../utils/response.js";
import { generateAllDataHateoasLinks } from "../../../../utils/hateoas.js";
import generatePagination from "../../../../utils/pagination.js";
import { serverError, unAuthorizedError } from "../../../../utils/error.js";
import { hasOwn } from "../../../../middleware/index.js";

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

const getUserById = async (req, res, _next) => {
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
    throw serverError(error);
  }
};

export default { create, getAll, getUserById };
