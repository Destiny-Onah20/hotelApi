import express from "express";
import passport from "passport";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import adminRoute from "./routers/admin.route";
import userRoute from "./routers/user.route";
import hotelRoute from "./routers/hotel.route";
import roomRoute from "./routers/rooms.router";
import bookRoute from "./routers/booking.route";
import logger from "./utils/logger";
import rateRoute from "./routers/rating.route";

const app = express();
app.use(cors());

app.use(fileUpload({
  useTempFiles: true
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


const server = http.createServer();
export const io = new Server(server);

io.on("connection", (socket) => {
  logger.info("A user connected!");
  socket.on("disconnect", () => {
    logger.info("A user disconnected!")
  })
});


app.use("/api/v1", adminRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", hotelRoute);
app.use("/api/v1", roomRoute);
app.use("/api/v1", bookRoute);
app.use("/api/v1", rateRoute);



export default app; 