import { Router } from "express";
import { allAdminHotels, changePassword, forgetPassword, loginAdmin, registerAdmin, getAllRoomsByAdmin, allAdminRoomsBooked, verifyAdmin, UpdateAdmin, sendAccessToken, changeEmailAddress } from "../controllers/admin.controllers";
import { loginValidate, validates } from "../middlewares/validates";
import { adminLogin, adminSchema } from "../schemas/admin.schema";
import { authID } from "../middlewares/authorization";


const adminRoute = Router();

adminRoute.route("/manager/register").post(validates(adminSchema), registerAdmin);
adminRoute.route("/manager/login").post(loginValidate(adminLogin), loginAdmin);
adminRoute.route("/manager/forgotten").post(forgetPassword);
adminRoute.route("/manager/verify/:adminId").patch(verifyAdmin);
adminRoute.route("/manager/change/:adminId").patch(changePassword);
adminRoute.route("/manager/update/:adminId").patch(UpdateAdmin);
adminRoute.route("/manager/email/:adminId").post(sendAccessToken);
adminRoute.route("/manager/changemail/:adminId").put(changeEmailAddress);
adminRoute.route("/manager/details/:adminId").get(authID, allAdminHotels);
adminRoute.route("/manager/rooms/:adminId").get(authID, getAllRoomsByAdmin);
adminRoute.route("/manager/booking/:adminId").get(authID, allAdminRoomsBooked);


export default adminRoute;