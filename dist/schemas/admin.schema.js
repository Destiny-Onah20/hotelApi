"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = exports.adminSchema = void 0;
const zod_1 = require("zod");
exports.adminSchema = (0, zod_1.object)({
    hotelName: (0, zod_1.string)({
        required_error: "hotelName is required."
    }).nonempty().min(2),
    password: (0, zod_1.string)({
        required_error: "Password is required."
    }).nonempty().min(6),
    email: (0, zod_1.string)({
        required_error: "email is required."
    }).nonempty().min(2).email("Invalid email format"),
});
exports.adminLogin = (0, zod_1.object)({
    password: (0, zod_1.string)({
        required_error: "Password is required."
    }).nonempty().min(6),
    email: (0, zod_1.string)({
        required_error: "email is required."
    }).nonempty().min(2).email("Invalid email format"),
});
