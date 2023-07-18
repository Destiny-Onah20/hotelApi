"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const admin_route_1 = __importDefault(require("./routers/admin.route"));
const user_route_1 = __importDefault(require("./routers/user.route"));
const hotel_route_1 = __importDefault(require("./routers/hotel.route"));
const rooms_router_1 = __importDefault(require("./routers/rooms.router"));
const booking_route_1 = __importDefault(require("./routers/booking.route"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
app.use((0, express_fileupload_1.default)({
    useTempFiles: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
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
exports.default = app;
