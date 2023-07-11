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
exports.registerRoom = void 0;
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const registerRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const hotelId = req.params.hotelId;
        const adminId = req.params.hotelId;
        const { roomNumber, roomDescription, price } = req.body;
        const hotelExists = yield hotel_model_1.default.findOne({ where: { id: hotelId } });
        if (!hotelExists) {
            return res.status(404).json({
                message: "This hotel does not exists!"
            });
        }
        ;
        if ((hotelExists === null || hotelExists === void 0 ? void 0 : hotelExists.adminId) !== parseInt(adminId)) {
            return res.status(400).json({
                message: "Please you are not authorized to perform this action!"
            });
        }
        ;
        const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
        if (!file) {
            throw new Error("no Image uploaded, Please add an image!");
        }
        const uploads = Array.isArray(file) ? file : [file];
        for (const file of uploads) {
            const result = yield cloudinary_1.default.uploader.upload(file.tempFilePath);
            ;
            const roomData = {
                roomNumber,
                roomDescription,
                price,
                image: result.secure_url,
                hotelId: Number(hotelId),
                adminId: Number(adminId)
            };
            const createRoom = yield rooms_model_1.default.create(roomData);
            if (!createRoom) {
                return res.status(400).json({
                    message: "An error occcured registering your room!"
                });
            }
            else {
                return res.status(201).json({
                    data: createRoom
                });
            }
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.registerRoom = registerRoom;
