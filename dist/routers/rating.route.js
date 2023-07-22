"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rating_controller_1 = require("../controllers/rating.controller");
const authorization_1 = require("../middlewares/authorization");
const rateRoute = (0, express_1.Router)();
rateRoute.route("/rate/:userId/:roomId").post(authorization_1.authorizedUser, rating_controller_1.rateAhotel);
exports.default = rateRoute;
