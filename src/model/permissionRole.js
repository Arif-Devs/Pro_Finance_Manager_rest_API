import { Schema, model } from 'mongoose';

const permissionRoleSchema = new Schema(
  {
    roleId: {
      required: true,
      type: Schema.ObjectId,
      ref: 'Role',
      unique: false,
    },
    permissionId: {
      require: true,
      type: Schema.ObjectId,
      ref: 'Permission',
      unique: false,
    },
  
},{ timestamps: true });



const PermissionRole = model('PermissionRole', permissionRoleSchema);

export default PermissionRole;
