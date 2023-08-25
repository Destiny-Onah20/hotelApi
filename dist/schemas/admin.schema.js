"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = exports.adminSchema = void 0;
const zod_1 = require("zod");
exports.adminSchema = (0, zod_1.object)({
    name: (0, zod_1.string)({
        required_error: "name is required."
    }).nonempty().min(2),
    password: (0, zod_1.string)({
        required_error: "Password is required."
    }).nonempty().min(6),
    email: (0, zod_1.string)({
        required_error: "email is required."
    }).nonempty().min(2).email("Invalid email format"),
});
// const validateAdminData = async (adminData: adminAttribute): Promise<string[] | null> => {
//   try {
//     await adminSchema.parseAsync(adminData);
//     return null; // No errors
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessages = error.errors.map((err) => err.message);
//       return errorMessages;
//     }
//     throw error;
//   }
// };
exports.adminLogin = (0, zod_1.object)({
    password: (0, zod_1.string)({
        required_error: "Password is required."
    }).nonempty().min(6),
    email: (0, zod_1.string)({
        required_error: "email is required."
    }).nonempty().min(2).email("Invalid email format"),
});
