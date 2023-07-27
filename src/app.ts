import express from "express";
import passport from "passport";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "swagger-jsdoc";
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


/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - name
 *         - password
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *         password:
 *           type: string
 *           description: The user's password.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address (must be a valid email).
 *       example:
 *         name: John Doe
 *         password: mysecurepassword
 *         email: johndoe@example.com
 */

/**
 * @swagger
 * /api/v1/hotel/hotels:
 *   get:
 *     summary: Get a list of all hotels.
 *     responses:
 *       200:
 *         description: A list of hotels.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hotels'
 */

const options = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'Hotel API',
      description: 'API documentation for ROOM applications we built while learning TypeScript',
      version: '1.0.0',
    },
  },
  servers: [
    {
      url: "https://hotel-api-7wlm.onrender.com/api/v1/", // url
      description: "Local server", // name
    },
  ],

  apis: ['./routers/admin.route.ts'],
};


const spec = swaggerJson(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

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