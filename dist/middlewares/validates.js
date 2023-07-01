"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.loginValidate = exports.validates = void 0;
const zod_1 = require("zod");
const schemaObj = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
const validates = (schema) => (req, res, next) => {
    try {
        schemaObj.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        schema.parse(req.body);
        next();
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
exports.validates = validates;
const loginValidate = (schema) => (req, res, next) => {
    try {
        schemaObj.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        schema.parse(req.body);
        next();
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
exports.loginValidate = loginValidate;
const validateUser = (Userschema) => (req, res, next) => {
    try {
        schemaObj.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        Userschema.parse(req.body);
        next();
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
exports.validateUser = validateUser;
