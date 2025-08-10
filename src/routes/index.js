import express from 'express';
const router = express.Router();
import authController from '../api/v1/controller/auth/index.js';
import PermissionController from '../api/v1/controller/permission/index.js';
import RoleController from '../api/v1/controller/role/index.js';
import userController from '../api/v1/controller/user/index.js'
import accountController from '../api/v1/controller/account/index.js';
import categoryController from '../api/v1/controller/category/index.js'
import expanseController from '../api/v1/controller/expanse/index.js'
import incomeController from '../api/v1/controller/income/index.js';
import { requestValidator, authenticate, authorization } from '../middleware/index.js';
import  {permissionRequest, RoleRequest,UserRequest,queryRequest, authRequest, accountRequest, categoryRequest, expanseRequest}  from '../request/index.js';
import userRequest from '../request/userRequest.js';



//Health route
router.get('/health', (_req, res) =>
    res.status(200).json({ code: 200, message: 'api health is ok' })
  );


// Auth endpoints
  router.post('/auth/register', authRequest.registerRequestValidator, requestValidator, authController.register )
  router.post('/auth/login', authRequest.loginRequestValidator, requestValidator, authController.login)


//Permission Routes ->
 router.route('/permissions')  
.post( authenticate, authorization(['create-permission']), permissionRequest.permissionCreateRequest,requestValidator,PermissionController.create)
.get(authenticate, authorization(['read-permission']), queryRequest.basicQueryParams,requestValidator,PermissionController.getAll)
router.route('/permissions/:id')
.put(authenticate , authorization(['update-permission']) , permissionRequest.permissionUpdatePUTRequest , requestValidator, PermissionController.updateByPut)
.delete(authenticate ,authorization(['delete-permission']) , PermissionController.deleteById)


//Role route
router.route('/roles')
.post(authenticate, authorization(['create-role']), RoleRequest.roleCreateRequest, requestValidator, RoleController.create)
.get(authenticate, authorization(['read-role']), queryRequest.basicQueryParams , requestValidator,  RoleController.getAll)
router.route('/roles/:id')
.patch(authenticate, authorization(['update-role']), RoleRequest.roleUpdateRequest , requestValidator, RoleController.updateByPatch)
.delete(authenticate, authorization(['delete-role']), RoleController.deleteById)


//user route
router.route('/users')
.post(authenticate, authorization(['create-user']), UserRequest.createRequestValidator, requestValidator, userController.create)
.get(authenticate, authorization(['read-permission']), queryRequest.basicQueryParams, requestValidator, userController.getAll)
router.route('/users/:id')
.get(authenticate, authorization(['single-user', 'single-own-user']), userController.getUserById)
.patch(authenticate, authorization(['update-user', 'update-own-user']), userRequest.UpdatePatchRequestValidator, requestValidator, userController.updateUserByPatch)
.put(authenticate ,  authorization(['update-user' , 'update-own-user']) , userController.updateByPut)
.delete(authenticate ,  authorization(['delete-user', 'delete-own-user']),userController.deleteById)


//account route
 router.route('/accounts')
 .post(authenticate, authorization(['create-account']), accountRequest.createRequestValidator ,requestValidator, accountController.create)
 .get(authenticate, authorization(['read-account']), queryRequest.basicQueryParams, requestValidator,accountController.getAll)
 router.route('/accounts/:id')
 .get(authenticate, authorization(['single-account', 'single-own-account']), accountController.getById)
 .patch(authenticate, authorization(['update-account', 'update-own-account']), accountRequest.UpdatePatchRequestValidator, requestValidator, accountController.updateByPatch)
 .put(authenticate , authorization(['update-account', 'update-own-account']), accountController.updateByPut)
 .delete(authenticate ,authorization(['delete-account', 'delete-own-account']), accountController.deleteById)

// category route
router.route('/categories')
.post(authenticate , authorization(['create-category']),categoryRequest.createRequestValidator, requestValidator, categoryController.create)
.get(authenticate , authorization(['read-category']), queryRequest.basicQueryParams, requestValidator, categoryController.getAllCategories)
router.route('/categories/:id')
.put(authenticate ,authorization(['update-category']),  categoryRequest.categoryUpdateRequest, requestValidator, categoryController.updateByPut)
.delete(authenticate ,authorization(['delete-category']),  categoryController.deleteById)



//expanse route
router.route('/expanses')
.post(authenticate, authorization(['create-expanse' , 'create-own-expanse']),expanseRequest.expanseCreateRequest, requestValidator, expanseController.create)
.get(authenticate , authorization(['read-expanse']), queryRequest.basicQueryParams , requestValidator,  expanseController.getAllExpanse)




//income route
router.route('/incomes')
.post(authenticate, authorization(['create-income' , 'create-own-income']), expanseRequest.expanseCreateRequest ,requestValidator, incomeController.create)
.get(authenticate, authorization(['read-income']), queryRequest.basicQueryParams, requestValidator, incomeController.getAllIncome)




























export default router