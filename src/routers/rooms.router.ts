import { Router } from "express";
import { registerRoom } from "../controllers/rooms.controller";
import { authID } from "../middlewares/authorization";

const roomRoute = Router();

roomRoute.route("/room/register/:adminId/:hotelId").post(authID, registerRoom);

export default roomRoute;