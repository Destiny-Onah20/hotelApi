import { Router } from "express";
import { allRooms, cheapHotelRooms, fourStarRooms, luxuryRooms, registerRoom } from "../controllers/rooms.controller";
import { authID } from "../middlewares/authorization";

const roomRoute = Router();

roomRoute.route("/room/register/:adminId/:hotelId").post(authID, registerRoom);
roomRoute.route("/room/rooms").get(allRooms);
roomRoute.route("/room/cheaprooms").get(cheapHotelRooms);
roomRoute.route("/room/starrooms").get(fourStarRooms);
roomRoute.route("/room/luxury").get(luxuryRooms);

export default roomRoute;