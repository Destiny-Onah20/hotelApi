"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomSchema = void 0;
const zod_1 = require("zod");
exports.roomSchema = (0, zod_1.object)({
    roomNumber: (0, zod_1.number)().transform((value) => {
        // Attempt to convert the value to a number
        const numericValue = Number(value);
        // Check if the conversion was successful
        if (isNaN(numericValue)) {
            throw new Error('Price must be a valid number');
        }
        return numericValue;
    }),
    roomDescription: (0, zod_1.string)({
        required_error: "Room description is required."
    }).nonempty(),
    price: (0, zod_1.number)().min(1000, "Price must be above ₦1000'")
        .transform((value) => {
        // Attempt to convert the value to a number
        const numericValue = Number(value);
        // Check if the conversion was successful
        if (isNaN(numericValue)) {
            throw new Error('Price must be a valid number');
        }
        return numericValue;
    }),
    image: (0, zod_1.string)({
        required_error: "Room description is required."
    }).nonempty(),
});
