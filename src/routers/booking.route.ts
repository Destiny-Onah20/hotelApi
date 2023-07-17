import { Router } from "express";
import { bookAroom } from "../controllers/booking.controller";
import { authorizedUser } from "../middlewares/authorization";

const bookRoute = Router();

bookRoute.route("/rooms/booking/:userId/:roomId").post(authorizedUser, bookAroom);

export default bookRoute;