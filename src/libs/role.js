import Role from "../model/role.js";
import PermissionRole from "../model/permissionRole.js";
import mongoose from "mongoose";
import { permissionLibs } from "./index.js";
import Permission from "../model/permission.js";
import { permissionRelationCheck } from "../utils/error.js";

//Create role and associate with permission

const create = async(name, permissions)=>{
    try {
        //create and save role
        const role = new Role()
        role.name = name
        await role.save()

        if(permissions && permissions.length > 0){
            for(const item of permissions){
                if(mongoose.Types.ObjectId.isValid(item)){
                    const existingAssociation = await PermissionRole.findOne({
                        $and: [{roleId: role._id}, {permissionId: item}]
                    }).exec()
                    
                    //check if permission exist
                    const permissionExist = await Permission.findById(item).exec()
                    
                    if(!existingAssociation && permissionExist !== null){
                        await permissionRelationCheck(item)
                        
                        //create and save the new permission-role association
                        const permissionRole = new PermissionRole()
                        permissionRole.roleId = role._id
                        permissionRole.permissionId = item
                        await permissionRole.save()
                        
                    }
                }
            }
        }

        const permissionIds = await permissionLibs.getPermissionsNameBasedOnRoleId(role._id)
        return{role: role.toJSON(), permission: permissionIds}


    } catch (error) {
        throw error
    }
}

//get all roles

const getAll = async ({search, sortBy ,sortType, limit , page}) => {
    try {
         // populate sortType val for query
          let sortTypeForDB = generateSortType(sortType);
          
          // destructured filter options for query
          let filter = {}
          if(search) filter.name = {$regex : search , $options : 'i'}

          // send request to db with all query params
          let roles = await Role.find(filter)
          .sort({[sortBy] : sortTypeForDB})
          .skip(page * limit - limit)
          .limit(limit)
          

          // count total roles based on search query params only, not apply on pagination
          let totalItems = await countRole(filter) ;

          // get permissions for associated roles
          const updatedRoles = await Promise.all(roles.map(async (role) => {
              const permissionIds = await PermissionLibs.getPermissionsBasedOnRoleId(role._id);
              
              let permissions = await Promise.all(permissionIds.map(async (id) => {
                const data = await Permission.findById(id).select(['name', '_id', 'createdAt', 'updatedAt']).exec();
                return {
                  ...(data ? data._doc : {}), 
                };
              }));

              return {
                ...(role && role._doc ? { ...role._doc } : {}),
                permissions,
              };
          }));

          return {
              updatedRoles,
              totalItems
          }
    } catch (error) {
        throw serverError(error)
    }
}


export default {create, getAll}