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

export default {create}