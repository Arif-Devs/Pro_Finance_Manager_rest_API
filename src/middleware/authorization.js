import { permissionLibs } from "../libs/index.js";
import Role from "../model/role.js";
import { unAuthenticateError, unAuthorizedError } from "../utils/error.js";

const authorization = (requiredPermissions = []) => async (req,_res,next) => {
    try {
        
        const role = await Role.findById(req.user.roleId).exec();        
        console.log(role);
        let userPermissions = await permissionLibs.getPermissionsNameBasedOnRoleId(req.user.roleId) || [];
        
        
        req.permissions = {
            requiredPermissions,
            userPermissions : userPermissions.flat(),
            userRole : role._doc.name
        };
        if(role._doc.name === 'admin' ||role._doc.name === 'Admin' ||role._doc.name === 'Super-Admin' ||role._doc.name === 'super-admin'){
            next();
        }else{
            // Check if the user has any of the requiredPermissions
            const hasRequiredPermission = requiredPermissions.some((requiredPermission) => {
                return userPermissions.flat().includes(requiredPermission);
            });
        
            if (!hasRequiredPermission) {
                throw unAuthorizedError('Access Denied!');
            }
            next()
        }
   
    } catch (error) {
        next(error)
    }
} 

export default authorization