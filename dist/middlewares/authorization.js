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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizedUser = exports.authID = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const user_admin_1 = __importDefault(require("../models/user.admin"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const validUser = yield admin_model_1.default.findOne({ where: { id: adminId } });
        if (!validUser) {
            return res.status(401).json({
                message: "This id does not exists!"
            });
        }
        const authenticToken = validUser.token;
        jsonwebtoken_1.default.verify(authenticToken, process.env.JWT_TOK, (error, payload) => {
            if (error) {
                return res.status(400).json({
                    message: "please log in!"
                });
            }
            else {
                req.user = payload;
                next();
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.authID = authID;
const authorizedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const validUser = yield user_admin_1.default.findOne({ where: { id: userId } });
        if (!validUser) {
            return res.status(401).json({
                message: "This id does not exists!"
            });
        }
        const authenticToken = validUser.token;
        jsonwebtoken_1.default.verify(authenticToken, process.env.JWT_TOK, (error, payload) => {
            if (error) {
                return res.status(400).json({
                    message: "Please Log in!"
                });
            }
            else {
                req.user = payload;
                next();
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.authorizedUser = authorizedUser;
