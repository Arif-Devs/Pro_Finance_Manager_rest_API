import Permission from '../model/permission.js';
import { notFoundError, serverError } from '../utils/error.js';
import PermissionRole from '../model/permissionRole.js';
import { generateSortType } from '../utils/query.js';



//Create Permission 

const createPermission = async (name) => {
  try {
    
    const permission = new Permission({ name }); // Create the new permission document
    await permission.save(); // Save the permission to the database
    
    return permission._doc; // return individual records from the database
  
  } catch (error) {
    throw serverError(error);
  }
};



const getPermissionsNameBasedOnRoleId = async (roleId) => {
  try {
    // Retrieve distinct permissionIds associated with the roleId
    const idOfPermission = await PermissionRole.find({ roleId })
      .distinct('permissionId')
      .exec();

    // Fetch all permissions with names in a single query
    const getSinglePermission = await Promise.all(
      idOfPermission.map(async (item) => {
        // Map to only include permission names
        const permission = await Permission.findById(item)
          .distinct('name')
          .exec();
        return permission;
      })
    );
    return getSinglePermission ? [...getSinglePermission] : [];
  } catch (error) {
    throw serverError(error);
  }
};

const count= (data)=>{
    return Role.countDocuments(data)
}


//get all permission
const getAll = async ({search, sortBy ,sortType, limit , page}) => {
    try {
        // populate sortType val for query
        let sortTypeForDB = generateSortType(sortType);
        
        // destructured filter options for query
        let filter = {}
        if(search) filter.name = {$regex : search , $options : 'i'}

        // send request to db with all query params
        let query = await Permission.find(filter)
        .sort({[sortBy] : sortTypeForDB})
        .skip(page * limit - limit)
        .limit(limit)
        

        // count total permissions based on search query params only, not apply on pagination
        let totalItems = await count(filter) ;

        return {
            query : query.length > 0 ? query : [],
            totalItems
        }
    } catch (error) {
        throw serverError(error)
    }
}


// Update or Create Permission to DB
const updateByPut = async (id,name) => {
    try {
        let permission = await Permission.findById(id);
        let state;

        if(!permission){
            const data = await Permission.findOne({name}).exec();
            if(data) throw notFoundError('Permission already exits!')
            permission = new Permission();
            permission.name = name;
            state = 'create'
        }else{
        permission.name = name; 
        state = 'update'
        }
        await permission.save();
        return {permission : permission._doc , state};
    } catch (error) {
        throw serverError(error)
    }
}




export default {
  
  createPermission,
  getPermissionsNameBasedOnRoleId,
  getAll,
  updateByPut
};
  
 