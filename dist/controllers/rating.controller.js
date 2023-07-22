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
exports.rateAhotel = void 0;
const rating_model_1 = __importDefault(require("../models/rating.model"));
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const rateAhotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { roomId } = req.params;
        const { rating, comment } = req.body;
        const roomTorate = yield rooms_model_1.default.findByPk(roomId);
        if (!roomTorate) {
            return res.status(404).json({
                message: `Room with this id: ${roomId} not found!`
            });
        }
        ;
        const previousRating = roomTorate.rating;
        const currentRate = previousRating + rating;
        console.log(previousRating);
        ;
        const rateData = {
            rating: currentRate,
            comment,
            roomId: Number(roomId),
            userId: Number(userId)
        };
        const ratings = yield rating_model_1.default.create(rateData);
        roomTorate.rating = rating;
        roomTorate.save();
        if (!ratings) {
            return res.status(400).json({
                message: "An error occured while rating this room!"
            });
        }
        else {
            return res.status(201).json({
                data: ratings
            });
        }
        ;
    }
    catch (error) {
        return res.status(500).json({
            message: error.messge
        });
    }
});
exports.rateAhotel = rateAhotel;
