"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const UserController = __importStar(require("../controllers/users.controller"));
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const userId = 1;
const user = userId + 1;
const userPayloade = {
    fullname: "Favour Igbani",
    email: "onahdestinyoh20@gmail.com",
    password: "75673f",
    confirmPassword: "75673f",
    phoneNumber: "0902024709k"
};
const userData = {
    fullname: 'testuser',
    email: 'test@example.com',
    password: 'testpassword',
    confirmPassword: "testpassword",
    phoneNumber: '09020241704'
};
describe("users", () => {
    describe("users registeration", () => {
        describe("given that the email has not been used by any other user", () => {
            it("should return the user payload", () => __awaiter(void 0, void 0, void 0, function* () {
                //@ts-ignore
                const createUserMock = jest.spyOn(UserController, 'registerUser').mockReturnValueOnce(userPayloade);
                const { statusCode, body } = yield (0, supertest_1.default)(app_1.default).post("/app/v1//user/register").send(userData);
                expect(statusCode).toBe(201);
                expect(body).toBe(userPayloade);
                expect(createUserMock).toHaveBeenCalledWith(userData);
            }));
        });
    });
    describe("given that the email and password does not match", () => {
        it("should return a 400", () => {
        });
    });
    describe("given that the controllers throws", () => {
        it("should return a 500 error", () => {
        });
    });
});
