import { Router } from "express";
import { validateUser } from "../middlewares/validates";
import { registerUser } from "../controllers/users.controller";
import { userSchema } from "../schemas/user.schema";


const userRoute = Router();

userRoute.route("/user/register").post(validateUser(userSchema), registerUser);

export default userRoute;