import register from "./registerController.js";
import login from "./loginController.js";
import logout from "./logoutController.js";
import {verifyOwner, verifyResetLink, resetPassword} from "./forgetPasswordController.js";
import refresh from "./refreshTokenController.js";

export default {register, login, logout, verifyOwner, verifyResetLink, resetPassword, refresh}
