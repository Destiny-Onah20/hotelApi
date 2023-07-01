"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const admin_route_1 = __importDefault(require("./routers/admin.route"));
const user_route_1 = __importDefault(require("./routers/user.route"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use((0, express_session_1.default)({
    secret: "ijfb3bfhir",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));
passport_1.default.serializeUser((user, callback) => {
    callback(null, user);
});
app.use("/api/v1", admin_route_1.default);
app.use("/api/v1", user_route_1.default);
exports.default = app;
