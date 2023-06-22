import { Router } from "express";
import { changePassword, forgetPassword, loginAdmin, registerAdmin } from "../controllers/admin.controllers";
import { loginValidate, validates } from "../middlewares/validates";
import { adminLogin, adminSchema } from "../schemas/admin.schema";


const adminRoute = Router();

adminRoute.route("/manager/register").post(validates(adminSchema), registerAdmin);
adminRoute.route("/manager/login").post(loginValidate(adminLogin), loginAdmin);
adminRoute.route("/manager/forgotten").post(forgetPassword);
adminRoute.route("/manager/change/:userId").patch(changePassword)

export default adminRoute;