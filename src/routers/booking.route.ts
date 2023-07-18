import { Router } from "express";
import { bookAroom, getTheNotification, notifyAdmind, allBooked } from "../controllers/booking.controller";
import { authorizedUser } from "../middlewares/authorization";

const bookRoute = Router();

bookRoute.route("/rooms/booking/:userId/:roomId").post(authorizedUser, bookAroom);
bookRoute.route("/notify/:userId").get(getTheNotification);
bookRoute.route("/manager/notify/:adminId").get(allBooked);

export default bookRoute;