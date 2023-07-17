"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const authorization_1 = require("../middlewares/authorization");
const bookRoute = (0, express_1.Router)();
bookRoute.route("/rooms/booking/:userId/:roomId").post(authorization_1.authorizedUser, booking_controller_1.bookAroom);
exports.default = bookRoute;
