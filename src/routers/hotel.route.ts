import { Router } from "express";
import { allHotels, hotelDetails, HotelsbySearch, registerHotel, searchFunction, updateHotel } from "../controllers/hotel.controller";
import { authID } from "../middlewares/authorization";

const hotelRoute = Router();

// hotelRoute.route("/hotel/register/:adminId").post(authID, multerUpload, registerHotel);
hotelRoute.route("/hotel/register/:adminId").post(authID, registerHotel);
hotelRoute.route("/hotel/update/:adminId/:hotelId").patch(authID, updateHotel);
hotelRoute.route("/hotel/hotels").get(allHotels);
hotelRoute.route("/hotel/hotels/:hotelId").get(hotelDetails);
hotelRoute.route("/hotel/search").post(searchFunction);




export default hotelRoute;
