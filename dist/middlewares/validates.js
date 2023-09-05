"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoom = exports.validateUser = exports.loginValidate = exports.validates = void 0;
const zod_1 = require("zod");
const schemaObj = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
const validates = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        schemaObj.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        yield schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.errors.map((error) => error.message);
            return res.status(400).json({
                message: errorMessages[0]
            });
        }
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.validates = validates;
const loginValidate = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        schemaObj.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        yield schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.errors.map((err) => err.message);
            return res.status(400).json({
                message: errorMessages[0]
            });
        }
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.loginValidate = loginValidate;
const validateUser = (Userschema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        schemaObj.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        yield Userschema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.errors.map((err) => err.message);
            return res.status(400).json({
                message: errorMessages[0]
            });
        }
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.validateUser = validateUser;
const validateRoom = (roomSchema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        schemaObj.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        yield roomSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.errors.map((err) => err.message);
            return res.status(400).json({
                message: errorMessages[0]
            });
        }
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.validateRoom = validateRoom;
