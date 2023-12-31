"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rooms_controller_1 = require("../controllers/rooms.controller");
const authorization_1 = require("../middlewares/authorization");
const admin_controllers_1 = require("../controllers/admin.controllers");
const roomRoute = (0, express_1.Router)();
roomRoute.route("/room/register/:adminId/:hotelId").post(authorization_1.authID, rooms_controller_1.registerRoom);
roomRoute.route("/room/rooms").get(rooms_controller_1.allRooms);
roomRoute.route("/room/cheaprooms").get(rooms_controller_1.cheapHotelRooms);
roomRoute.route("/room/starrooms").get(rooms_controller_1.fourStarRooms);
roomRoute.route("/room/luxury").get(rooms_controller_1.luxuryRooms);
roomRoute.route("/room/:roomId").get(rooms_controller_1.roomDetail);
roomRoute.route("/room/admin/:adminId").get(authorization_1.authID, rooms_controller_1.allAdminRooms);
//admin Rooms
roomRoute.route("/room/vacant/:adminId").get(admin_controllers_1.vacantRoomByAdmin);
roomRoute.route("/room/:id").delete(rooms_controller_1.deleteRoom);
exports.default = roomRoute;
