import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/admin.controllers";
import { validates } from "../middlewares/validates";
import { adminSchema } from "../schemas/admin.schema";


const adminRoute = Router();

adminRoute.route("/manager/register").post(validates(adminSchema), registerAdmin);
adminRoute.route("/manager/login").post(validates(adminSchema), loginAdmin);

export default adminRoute;