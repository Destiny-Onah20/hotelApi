"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = __importDefault(require("./routers/admin.route"));
const user_route_1 = __importDefault(require("./routers/user.route"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const hotel_route_1 = __importDefault(require("./routers/hotel.route"));
const rooms_router_1 = __importDefault(require("./routers/rooms.router"));
const app = (0, express_1.default)();
app.use((0, express_fileupload_1.default)({
    useTempFiles: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use("/api/v1", admin_route_1.default);
app.use("/api/v1", user_route_1.default);
app.use("/api/v1", hotel_route_1.default);
app.use("/api/v1", rooms_router_1.default);
exports.default = app;
