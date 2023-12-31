"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controllers_1 = require("../controllers/admin.controllers");
const validates_1 = require("../middlewares/validates");
const admin_schema_1 = require("../schemas/admin.schema");
const authorization_1 = require("../middlewares/authorization");
const adminRoute = (0, express_1.Router)();
adminRoute.route("/manager/register").post((0, validates_1.validates)(admin_schema_1.adminSchema), admin_controllers_1.registerAdmin);
adminRoute.route("/manager/login").post((0, validates_1.loginValidate)(admin_schema_1.adminLogin), admin_controllers_1.loginAdmin);
adminRoute.route("/manager/forgotten").post(admin_controllers_1.forgetPassword);
adminRoute.route("/manager/verify/:adminId").patch(admin_controllers_1.verifyAdmin);
adminRoute.route("/manager/change/:adminId").patch(admin_controllers_1.changePassword);
adminRoute.route("/manager/update/:adminId").patch(admin_controllers_1.UpdateAdmin);
adminRoute.route("/manager/email/:adminId").post(admin_controllers_1.sendAccessToken);
adminRoute.route("/manager/changemail/:adminId").put(admin_controllers_1.changeEmailAddress);
adminRoute.route("/manager/details/:adminId").get(authorization_1.authID, admin_controllers_1.allAdminHotels);
adminRoute.route("/manager/rooms/:adminId").get(authorization_1.authID, admin_controllers_1.getAllRoomsByAdmin);
adminRoute.route("/manager/logout/:adminId").post(authorization_1.authID, admin_controllers_1.logOut);
adminRoute.route("/manager/booking/:adminId").get(authorization_1.authID, admin_controllers_1.allAdminRoomsBooked);
adminRoute.route("/manager/all").get(admin_controllers_1.getAllAdmin);
adminRoute.route("/manager/hotels/:adminId").get(authorization_1.authID, admin_controllers_1.AdminHotel);
adminRoute.route("/manager/:accessToken").get(admin_controllers_1.getAllAdmin);
adminRoute.route("/manager/delete/:adminId").delete(admin_controllers_1.deleteAdmin);
exports.default = adminRoute;
