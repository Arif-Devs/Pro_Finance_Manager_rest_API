import Permission from '../model/permission.js';
import { notFoundError, serverError } from '../utils/error.js';
import PermissionRole from '../model/permissionRole.js';



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




export default {
  
  createPermission,
  getPermissionsNameBasedOnRoleId,
  
};
  
 