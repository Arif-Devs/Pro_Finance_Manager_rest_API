// export const hasOwn = (permissions, id, user) => {
//   const isAdminRole = ["admin", "Admin", "super-admin", "Super-Admin"].includes(permissions);
 
  
//   if (isAdminRole) return true;

//   // Check if user has all required permissions 
//   const hasAllRequiredPermission = permissions.requiredPermissions.every((perm) => {
//       permissions.userPermissions.includes(perm);
//     }
//   );
  

//   if (hasAllRequiredPermission) return true;

//   // Check for "own" permissions
//   const ownPermissions = permissions.requiredPermissions.filter((perm) =>perm.includes("own"));
  
//   if (ownPermissions.length > 0) {
//     // Check if the user has at least one "own" permission
//     const hasOwnPermission = ownPermissions.some((ownPerm) => permissions.userPermissions.includes(ownPerm));

//     if (hasOwnPermission) {
//       // Ensure the user is modifying their own data
//       if (id !== user._id) {
//         throw new Error(
//           "You Do not have permit to modify or read other user data!"
//         );
//       }
//       return true;
//     }
//     return false;
//   }
//   return false;
// };

export const hasOwn = (permissions,id,user) => {
    if (permissions.userRole === 'admin' || permissions.userRole === 'Admin' || permissions.userRole === 'Super-Admin' || permissions.userRole === 'super-admin') {
        return true;
    } else {
        const hasEvery = permissions.requiredPermissions.every((item) => permissions.userPermissions.includes(item));
        if (hasEvery) {
            return true;
        } else {
            let findOwn = permissions.requiredPermissions.filter((item) => item.includes('own'));
            if (findOwn.length > 0) { 
                const getOwn = permissions.userPermissions.filter((item) => item === findOwn[0]);
                if (getOwn.length > 0) { 
                    if (id !== user._id) {
                        throw new Error('You Do not have permit to modify or read other user data!'); // Throw a new Error
                    } else {
                        return true
                    }
                }else{
                    return true;
                }
            } else {
                return true
            }
        }
    }
};
