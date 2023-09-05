"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomSchema = void 0;
const zod_1 = require("zod");
exports.roomSchema = (0, zod_1.object)({
    roomNumber: (0, zod_1.number)({
        required_error: "Room number is required."
    }),
    roomDescription: (0, zod_1.string)({
        required_error: "Room description is required."
    }).nonempty(),
    price: (0, zod_1.number)({
        required_error: "email is required."
    }).min(3, "Price must be above ₦1000"),
    image: (0, zod_1.string)({
        required_error: "Room description is required."
    }).nonempty(),
});
