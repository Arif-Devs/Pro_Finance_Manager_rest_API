import { permissionLibs } from "../../../../libs/index.js";
import {
  LIMIT,
  PAGE,
  SEARCH,
  SORTBY,
  SORTTYPE,
} from "../../../../config/default.js";
import transformMongooseDocs from "../../../../utils/response.js";
import generatePagination from "../../../../utils/pagination.js";
import { generateAllDataHateoasLinks } from "../../../../utils/hateoas.js";

//Create permission
const create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const permission = await permissionLibs.createPermission(name);

    // Send response to user
    res.status(201).json({
      code: 201,
      message: "Permission has been created!",
      data: { ...permission },
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    let { limit, page, sortType, sortBy, search } = req.query;

    // set default search params
    limit = +limit || LIMIT;
    page = +page || PAGE;
    sortBy = sortBy || SORTBY;
    sortType = sortType || SORTTYPE;
    search = search || SEARCH;

    let { query, totalItems } = await permissionLibs.getAll({
      search,
      sortBy,
      sortType,
      limit,
      page,
    });

    // count total Page
    let totalPage = Math.ceil(totalItems / limit);

    // generate final responses data
    let result = {
      code: 200,
      message: "Successfully data Retrieved!",
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

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Update or Create Permission to DB
const updateByPut = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const { permission, state } = await permissionLibs.updateByPut(id, name);

    res.status(state === "create" ? 201 : 200).json({
      code: state === "create" ? 201 : 200,
      message: `Permission ${
        state == "create" ? "Created" : "Updated"
      } Successfully!`,
      data: { ...permission },
    });
  } catch (error) {
    next(error);
  }
};

// Delete Single Permission by Id
const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDeleted = await PermissionLibs.deleteById(id);
    if (isDeleted) {
      res.status(204).json({
        code: 204,
        message: "Permission Deleted Successfully!",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Delete Multiple Permission by Id
const bulkDelete = async (req,res,next) => {
    try {
    const {id} = req.params;
    const isDeleted = await PermissionLibs.deleteById(id)
    if(isDeleted){
        res.status(204).json({
            code : 204,
            message : 'Permission Deleted Successfully!',
        })
    }
    } catch (error) {
      next(error)
    }
}


export { create, getAll, updateByPut, deleteById, bulkDelete };
