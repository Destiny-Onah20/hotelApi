import { Router } from "express";
import { allHotels, hotelDetails, hotelsInAbuja, hotelsInCalabar, hotelsInKano, hotelsInLagos, registerHotel, searchFunction, updateHotel } from "../controllers/hotel.controller";
import { authID } from "../middlewares/authorization";

const hotelRoute = Router();

// hotelRoute.route("/hotel/register/:adminId").post(authID, multerUpload, registerHotel);
hotelRoute.route("/hotel/register/:adminId").post(authID, registerHotel);
hotelRoute.route("/hotel/update/:adminId/:hotelId").patch(authID, updateHotel);
hotelRoute.route("/hotel/hotels").get(allHotels);
hotelRoute.route("/hotel/lagos").get(hotelsInLagos);
hotelRoute.route("/hotel/abuja").get(hotelsInAbuja);
hotelRoute.route("/hotel/kano").get(hotelsInKano);
hotelRoute.route("/hotel/calabar").get(hotelsInCalabar);
hotelRoute.route("/hotel/hotels/:hotelId").get(hotelDetails);
hotelRoute.route("/hotel/search").post(searchFunction);




export default hotelRoute;
