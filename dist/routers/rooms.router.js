"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rooms_controller_1 = require("../controllers/rooms.controller");
const authorization_1 = require("../middlewares/authorization");
const roomRoute = (0, express_1.Router)();
roomRoute.route("/room/register/:adminId/:hotelId").post(authorization_1.authID, rooms_controller_1.registerRoom);
exports.default = roomRoute;
