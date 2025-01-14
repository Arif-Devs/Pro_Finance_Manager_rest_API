export const hasOwn = (permissions, id, user) => {
  const isAdminRole = ["admin", "Admin", "super-admin", "Super-Admin"].includes(permissions);
 
  
  if (isAdminRole) return true;

  // Check if user has all required permissions 
  const hasAllRequiredPermission = permissions.requiredPermissions.every((perm) => {
      permissions.userPermissions.includes(perm);
    }
  );
  

  if (hasAllRequiredPermission) return true;

  // Check for "own" permissions
  const ownPermissions = permissions.requiredPermissions.filter((perm) =>perm.includes("own"));
  
  if (ownPermissions.length > 0) {
    // Check if the user has at least one "own" permission
    const hasOwnPermission = ownPermissions.some((ownPerm) => permissions.userPermissions.includes(ownPerm));

    if (hasOwnPermission) {
      // Ensure the user is modifying their own data
      if (id !== user._id) {
        throw new Error(
          "You Do not have permit to modify or read other user data!"
        );
      }
      return true;
    }
    return false;
  }
  return false;
};

