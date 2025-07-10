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


//Role route
router.route('/roles')
.post(authenticate, authorization(['create-role']), RoleRequest.roleCreateRequest, requestValidator, RoleController.create)



//user route
router.route('/users')
.post(authenticate, authorization(['create-user']), UserRequest.createRequestValidator, requestValidator, userController.create)
.get(authenticate, authorization(['read-permission']), queryRequest.basicQueryParams, requestValidator, userController.getAll)
router.route('/users/:id')
.get(authenticate, authorization(['single-user', 'single-own-user']), userController.getUserById)
.patch(authenticate, authorization(['update-user' , 'update-own-user']), userRequest.UpdatePatchRequestValidator, requestValidator, userController.updateUserByPatch)

//account route
 router.route('/accounts')
 .post(authenticate , authorization(['create-account']), accountRequest.createRequestValidator ,requestValidator, accountController.create)
 .get(authenticate , authorization(['read-account']), queryRequest.basicQueryParams , requestValidator,accountController.getAll)



// category route
router.route('/categories')
.post(authenticate , authorization(['create-category']),categoryRequest.createRequestValidator, requestValidator, categoryController.create)
.get(authenticate , authorization(['read-category']),queryRequest.basicQueryParams, requestValidator, categoryController.getAllCategories)


//expanse route
router.route('/expanses')
.post(authenticate, authorization(['create-expanse' , 'create-own-expanse']),expanseRequest.expanseCreateRequest, requestValidator, expanseController.create)
.get(authenticate , authorization(['read-expanse']), queryRequest.basicQueryParams , requestValidator,  expanseController.getAllExpanse)




//income route
router.route('/incomes')
.post(authenticate, authorization(['create-income' , 'create-own-income']), expanseRequest.expanseCreateRequest ,requestValidator, incomeController.create)
.get(authenticate, authorization(['read-income']), queryRequest.basicQueryParams, requestValidator, incomeController.getAllIncome)




























export default router