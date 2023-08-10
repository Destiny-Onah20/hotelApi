import { Router } from "express";
import { loginValidate, validateUser } from "../middlewares/validates";
import { changePasswordUser, facebookSignUp, forgottenPassword, loginUser, logout, registerUser, roomsBookedByUser, updateImage, updateUser, verifyUser } from "../controllers/users.controller";
import { userSchema } from "../schemas/user.schema";
import { adminLogin } from "../schemas/admin.schema";
import passport from "passport";
import { authorizedUser } from "../middlewares/authorization";


const userRoute = Router();

userRoute.route("/user/register").post(validateUser(userSchema), registerUser);
userRoute.route("/user/login").post(loginValidate(adminLogin), loginUser);
userRoute.route("/user/auth/facebook").get(passport.authenticate("facebook", { scope: ["email"] }), facebookSignUp)
userRoute.route("/user/verify/:userId").patch(verifyUser);
userRoute.route("/user/forgot").post(forgottenPassword);

userRoute.route("/user/logout/:userId").post(logout);
userRoute.route("/user/change/:userId").patch(changePasswordUser);

userRoute.route("/user/update/:userId").patch(authorizedUser, updateUser);
userRoute.route("/user/image/:userId").patch(authorizedUser, updateImage);

userRoute.route("/user/booking/:userId").get(authorizedUser, roomsBookedByUser)

userRoute.route("/").get((req, res) => {
  res.send(`<a href="http://localhost:1800/api/v1/user/auth/facebook">Login with your facebook account</a>`)
})

export default userRoute;