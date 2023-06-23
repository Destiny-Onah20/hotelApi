import { Router } from "express";
import { loginValidate, validateUser } from "../middlewares/validates";
import { loginUser, registerUser } from "../controllers/users.controller";
import { userSchema } from "../schemas/user.schema";
import { adminLogin } from "../schemas/admin.schema";


const userRoute = Router();

userRoute.route("/user/register").post(validateUser(userSchema), registerUser);
userRoute.route("/user/login").post(loginValidate(adminLogin), loginUser);

export default userRoute;