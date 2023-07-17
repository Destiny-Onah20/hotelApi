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
exports.bookAroom = void 0;
const booking_model_1 = __importDefault(require("../models/booking.model"));
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const bookAroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const roomId = req.params.roomId;
        const { checkIn, checkOut } = req.body;
        const bookingRoom = yield rooms_model_1.default.findByPk(roomId);
        if (!bookingRoom || (bookingRoom === null || bookingRoom === void 0 ? void 0 : bookingRoom.booked)) {
            return res.status(400).json({
                message: 'THis room has already been booked! Or does not exists!'
            });
        }
        ;
        const bookData = {
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            userId: Number(userId),
            roomId: Number(roomId)
        };
        const bookRoom = yield booking_model_1.default.create(bookData);
        bookingRoom.booked = true;
        yield bookingRoom.save();
        return res.status(201).json({
            mesage: "Room booked!",
            data: bookRoom
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.bookAroom = bookAroom;
console.log(new Date("2023-07-16"));
