import { Router } from "express";
import { allAdminRooms, allRooms, cheapHotelRooms, fourStarRooms, luxuryRooms, registerRoom, roomDetail } from "../controllers/rooms.controller";
import { authID } from "../middlewares/authorization";
import { vacantRoomByAdmin } from "../controllers/admin.controllers";

const roomRoute = Router();

roomRoute.route("/room/register/:adminId/:hotelId").post(authID, registerRoom);
roomRoute.route("/room/rooms").get(allRooms);
roomRoute.route("/room/cheaprooms").get(cheapHotelRooms);
roomRoute.route("/room/starrooms").get(fourStarRooms);
roomRoute.route("/room/luxury").get(luxuryRooms);

roomRoute.route("/room/:roomId").get(roomDetail);
roomRoute.route("/room/admin/:adminId").get(authID, allAdminRooms);

//admin Rooms
roomRoute.route("/room/vacant/:adminId").get(vacantRoomByAdmin);


export default roomRoute;