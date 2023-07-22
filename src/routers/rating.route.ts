import { Router } from "express";
import { rateAhotel } from "../controllers/rating.controller";
import { authorizedUser } from "../middlewares/authorization";

const rateRoute = Router();

rateRoute.route("/rate/:userId/:roomId").post(authorizedUser, rateAhotel);

export default rateRoute;  