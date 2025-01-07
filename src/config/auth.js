// Access Token Validation Time
const ACCESSTOKENLIFETIME = '30day'

// Refresh Token Validation Time
const REFRESHTOKENLIFETIME = '60day'


// Default User Password
const DEFAULTPASS = 'Arif@8322'

// permission array
const PERMISSIONSARRAY = ['create-permission','read-permission', 'update-permission','delete-permission','create-role','update-role', 'read-role','delete-role','create-user','read-user','update-user','delete-user','single-user', 'create-category','read-category','update-category', 'delete-category','create-account','read-account','update-account', 'delete-account','single-account','create-expanse','read-expanse','update-expanse','delete-expanse','single-expanse','create-income','read-income','update-income','delete-income', 'single-income', 'data-analysis', 'single-own-analysis','update-password','update-own-password','single-analysis','update-own-user','single-own-user','delete-own-user','update-own-income','single-own-income','delete-own-income','update-own-account','single-own-account','delete-own-account','update-own-expanse','delete-own-expanse','single-own-expanse'];

const USERPERMISSION = ['create-account','create-expanse','create-income','single-own-analysis','update-own-password','update-own-user','single-own-user','delete-own-user','update-own-account','single-own-account','delete-own-account','update-own-expanse','single-own-expanse','delete-own-expanse','update-own-income','single-own-income','delete-own-income'];



export {
    ACCESSTOKENLIFETIME,
    REFRESHTOKENLIFETIME,
    DEFAULTPASS,
    PERMISSIONSARRAY,
    USERPERMISSION
}
