import express from "express";
import passport from "passport";
import adminRoute from "./routers/admin.route";
import userRoute from "./routers/user.route";
import fileUpload from "express-fileupload";
import hotelRoute from "./routers/hotel.route";
import roomRoute from "./routers/rooms.router";
import bookRoute from "./routers/booking.route";

const app = express();

app.use(fileUpload({
  useTempFiles: true
}))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/api/v1", adminRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", hotelRoute);
app.use("/api/v1", roomRoute);
app.use("/api/v1", bookRoute);


export default app;