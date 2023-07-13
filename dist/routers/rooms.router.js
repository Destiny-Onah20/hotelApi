"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rooms_controller_1 = require("../controllers/rooms.controller");
const authorization_1 = require("../middlewares/authorization");
const roomRoute = (0, express_1.Router)();
roomRoute.route("/room/register/:adminId/:hotelId").post(authorization_1.authID, rooms_controller_1.registerRoom);
roomRoute.route("/room/rooms").get(rooms_controller_1.allRooms);
roomRoute.route("/room/cheaprooms").get(rooms_controller_1.cheapHotelRooms);
roomRoute.route("/room/starrooms").get(rooms_controller_1.fourStarRooms);
roomRoute.route("/room/luxury").get(rooms_controller_1.luxuryRooms);
exports.default = roomRoute;
