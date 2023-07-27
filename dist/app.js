"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const http_1 = __importDefault(require("http"));
const admin_route_1 = __importDefault(require("./routers/admin.route"));
const user_route_1 = __importDefault(require("./routers/user.route"));
const hotel_route_1 = __importDefault(require("./routers/hotel.route"));
const rooms_router_1 = __importDefault(require("./routers/rooms.router"));
const booking_route_1 = __importDefault(require("./routers/booking.route"));
const logger_1 = __importDefault(require("./utils/logger"));
const rating_route_1 = __importDefault(require("./routers/rating.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
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
            url: "http://localhost:1100/api/v1",
            description: "Local server", // name
        },
    ],
    apis: ['./routers/admin.route.ts'],
};
const spec = (0, swagger_jsdoc_1.default)(options);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec));
const server = http_1.default.createServer();
exports.io = new socket_io_1.Server(server);
exports.io.on("connection", (socket) => {
    logger_1.default.info("A user connected!");
    socket.on("disconnect", () => {
        logger_1.default.info("A user disconnected!");
    });
});
app.use("/api/v1", admin_route_1.default);
app.use("/api/v1", user_route_1.default);
app.use("/api/v1", hotel_route_1.default);
app.use("/api/v1", rooms_router_1.default);
app.use("/api/v1", booking_route_1.default);
app.use("/api/v1", rating_route_1.default);
exports.default = app;
