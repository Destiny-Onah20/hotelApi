"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = (0, zod_1.object)({
    fullname: (0, zod_1.string)({
        required_error: "hotelName is required."
    }).nonempty().min(2),
    password: (0, zod_1.string)({
        required_error: "Password is required."
    }).nonempty().min(6, "Password must be atleast six (6) characters long"),
    email: (0, zod_1.string)({
        required_error: "email is required."
    }).nonempty().min(2).email("Invalid email format"),
    phoneNumber: (0, zod_1.string)({
        required_error: "phone-number is required."
    }).min(10, "Phone number must be a valid number please"),
    confirmPassword: (0, zod_1.string)({
        required_error: "required."
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"]
});
