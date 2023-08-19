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
exports.deleteRoom = exports.allAdminRooms = exports.roomDetail = exports.luxuryRooms = exports.fourStarRooms = exports.cheapHotelRooms = exports.allRooms = exports.registerRoom = void 0;
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const registerRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const hotelId = req.params.hotelId;
        const adminId = req.params.adminId;
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
        ;
        const uploads = Array.isArray(file) ? file : [file];
        for (const file of uploads) {
            const result = yield cloudinary_1.default.uploader.upload(file.tempFilePath);
            ;
            const roomData = {
                roomNumber,
                roomDescription,
                price,
                image: result.secure_url,
                cloudId: result.public_id,
                address: hotelExists.address,
                hotelname: hotelExists.hotelName,
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
        ;
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.registerRoom = registerRoom;
const allRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield rooms_model_1.default.findAll({
            order: config_1.default.random(),
        });
        if (all.length === 0) {
            return res.status(404).json({
                message: "Sorry no rooms available for the moment!"
            });
        }
        else {
            return res.status(200).json({
                messge: "All rooms : " + all.length,
                data: all
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.allRooms = allRooms;
const cheapHotelRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cheapRoom = yield rooms_model_1.default.findAll({
            where: {
                price: {
                    [sequelize_1.Op.lte]: 20000
                },
                booked: false
            }
        });
        if (cheapRoom.length === 0) {
            return res.status(404).json({
                message: "No room found!"
            });
        }
        else {
            return res.status(200).json({
                data: cheapRoom
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.cheapHotelRooms = cheapHotelRooms;
const fourStarRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const niceRoom = yield rooms_model_1.default.findAll({
            where: {
                price: { [sequelize_1.Op.gte]: 20000, [sequelize_1.Op.lte]: 100000 },
                booked: false
            }
        });
        if (niceRoom.length === 0) {
            return res.status(404).json({
                message: "No room found!"
            });
        }
        return res.status(200).json({
            message: "All 4 star rooms " + niceRoom.length,
            data: niceRoom
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.fourStarRooms = fourStarRooms;
const luxuryRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const luxury = yield rooms_model_1.default.findAll({
            where: {
                price: { [sequelize_1.Op.gte]: 80000 },
                booked: false
            }
        });
        if (luxury.length === 0) {
            return res.status(400).json({
                message: "No Expensive rooms for now!"
            });
        }
        else {
            return res.status(200).json({
                message: "All Luxury rooms " + luxury.length,
                data: luxury
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.luxuryRooms = luxuryRooms;
const roomDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.roomId;
        const theRoom = yield rooms_model_1.default.findByPk(roomId);
        if (!theRoom) {
            return res.status(404).json({
                messaege: `Room with this id: ${roomId} not found!`
            });
        }
        return res.status(200).json({
            mesaage: "the Room",
            data: theRoom
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.roomDetail = roomDetail;
const allAdminRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const allRooms = yield rooms_model_1.default.findAll({
            where: { adminId }
        });
        if (!allRooms) {
            return res.status(404).json({
                message: "No room found!"
            });
        }
        else {
            return res.status(200).json({
                message: "All Admin Rooms",
                length: allRooms.length,
                data: allRooms
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.allAdminRooms = allAdminRooms;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomId = req.params.id;
        const theRoom = yield rooms_model_1.default.findByPk(roomId);
        if (!theRoom) {
            return res.status(404).json({
                message: "This room does not found!"
            });
        }
        yield cloudinary_1.default.uploader.destroy(theRoom.cloudId);
        yield rooms_model_1.default.destroy({ where: { id: roomId } });
        return res.status(200).json({
            message: "Deleted success!"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.deleteRoom = deleteRoom;
