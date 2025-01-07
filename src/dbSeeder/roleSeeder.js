import { USERPERMISSION } from '../config/auth.js';
import Permission from '../model/permission.js';
import PermissionRole from '../model/permissionRole.js';
import Role from '../model/role.js';

const roleSeeder = async (roles = ['admin', 'user', 'editor']) => {
    try {
        // Clear existing roles and permission-role associations
        await Role.deleteMany()
        await PermissionRole.deleteMany()


        for (const roleName of roles) {
            const role = new Role({ name: roleName })
            await role.save()

            // If the role is 'user', assign user permissions
            if (roleName === 'user') {
                for (const permissionName of USERPERMISSION) {
                    const permission = await Permission.findOne({ name: permissionName }).exec()
                    if (permission) {
                        const permissionRole = new PermissionRole({
                            roleId: role.id,
                            permissionId: permission.id,
                        });
                        await permissionRole.save()
                    } else {
                        console.warn(`Permission '${permissionName}' not found.`)
                    }
                }
            }
        }

        console.log('Roles created successfully!');
    } catch (error) {
        console.error('Error during role seeding:', error);
        throw error;
    }
};

export default roleSeeder;
