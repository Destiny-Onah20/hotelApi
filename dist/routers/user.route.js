"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validates_1 = require("../middlewares/validates");
const users_controller_1 = require("../controllers/users.controller");
const user_schema_1 = require("../schemas/user.schema");
const admin_schema_1 = require("../schemas/admin.schema");
const passport_1 = __importDefault(require("passport"));
const authorization_1 = require("../middlewares/authorization");
const userRoute = (0, express_1.Router)();
userRoute.route("/user/register").post((0, validates_1.validateUser)(user_schema_1.userSchema), users_controller_1.registerUser);
userRoute.route("/user/login").post((0, validates_1.loginValidate)(admin_schema_1.adminLogin), users_controller_1.loginUser);
userRoute.route("/user/auth/facebook").get(passport_1.default.authenticate("facebook", { scope: ["email"] }), users_controller_1.facebookSignUp);
userRoute.route("/user/verify/:userId").patch(users_controller_1.verifyUser);
userRoute.route("/user/forgot").post(users_controller_1.forgottenPassword);
userRoute.route("/user/logout/:userId").post(users_controller_1.logout);
userRoute.route("/user/change/:userId").patch(users_controller_1.changePasswordUser);
userRoute.route("/user/update/:userId").patch(authorization_1.authorizedUser, users_controller_1.updateUser);
userRoute.route("/user/image/:userId").patch(authorization_1.authorizedUser, users_controller_1.updateImage);
userRoute.route("/user/booking/:userId").get(authorization_1.authorizedUser, users_controller_1.roomsBookedByUser);
userRoute.route("/").get((req, res) => {
    res.send(`<a href="http://localhost:1800/api/v1/user/auth/facebook">Login with your facebook account</a>`);
});
exports.default = userRoute;
