import { Router } from "express";
import { loginValidate, validateUser } from "../middlewares/validates";
import { changePasswordUser, forgottenPassword, loginUser, registerUser, verifyUser } from "../controllers/users.controller";
import { userSchema } from "../schemas/user.schema";
import { adminLogin } from "../schemas/admin.schema";


const userRoute = Router();

userRoute.route("/user/register").post(validateUser(userSchema), registerUser);
userRoute.route("/user/login").post(loginValidate(adminLogin), loginUser);
userRoute.route("/user/verify/:userId").patch(verifyUser);
userRoute.route("/user/forgot").post(forgottenPassword)
userRoute.route("/user/change/:userId").patch(changePasswordUser)

export default userRoute;