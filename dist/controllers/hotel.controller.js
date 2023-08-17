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
exports.searchFunction = exports.hotelsInCalabar = exports.hotelsInKano = exports.hotelsInAbuja = exports.hotelsInLagos = exports.updateHotel = exports.hotelDetails = exports.allHotels = exports.registerHotel = void 0;
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const config_1 = __importDefault(require("../config/config"));
const sequelize_1 = require("sequelize");
const registerHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = req.params.adminId;
        const { hotelName, address, description, website, email, city, state } = req.body;
        const validAdmin = yield admin_model_1.default.findOne({ where: { id: adminId } });
        if (!validAdmin) {
            return res.status(400).json({
                message: "Please register yourself first!"
            });
        }
        ;
        const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.imageId;
        if (!file) {
            res.status(400).json({ error: 'No file provided' });
            return;
        }
        else {
            const uploads = Array.isArray(file) ? file : [file];
            for (const file of uploads) {
                const result = yield cloudinary_1.default.uploader.upload(file.tempFilePath);
                ;
                const data = {
                    hotelName: hotelName.toUpperCase(),
                    address,
                    description,
                    website,
                    email,
                    city,
                    state,
                    imageId: result.secure_url,
                    cloudId: result.public_id,
                    adminId: Number(adminId)
                };
                const createHotel = yield hotel_model_1.default.create(data);
                return res.status(201).json({
                    message: "Hotel Registered.",
                    data: createHotel
                });
            }
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.registerHotel = registerHotel;
const allHotels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield hotel_model_1.default.findAll({
            order: config_1.default.random(),
        });
        if (hotels.length === 0) {
            return res.status(404).json({
                message: "Sorry no hotels for now!"
            });
        }
        else {
            return res.status(200).json({
                message: "All hotels " + hotels.length,
                data: hotels
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.allHotels = allHotels;
const hotelDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotelId = req.params.hotelId;
        const hotelInDB = yield hotel_model_1.default.findByPk(hotelId, {
            include: [rooms_model_1.default]
        });
        if (!hotelInDB) {
            return res.status(404).json({
                message: `No hotel with this id: ${hotelId}`
            });
        }
        else {
            return res.status(200).json({
                message: `Here is ${hotelInDB.hotelName}`,
                data: hotelInDB
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.hotelDetails = hotelDetails;
const updateHotel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const hotelId = req.params.hotelId;
        const adminId = req.params.adminId;
        const { hotelName, address, description, website, email, city, state } = req.body;
        const hotelToUpdate = yield hotel_model_1.default.findOne({ where: { id: hotelId } });
        if ((hotelToUpdate === null || hotelToUpdate === void 0 ? void 0 : hotelToUpdate.adminId) !== parseInt(adminId)) {
            return res.status(401).json({
                message: "You are not authorized to perform this action!"
            });
        }
        ;
        const file = (_b = req.files) === null || _b === void 0 ? void 0 : _b.imageId;
        const uploads = Array.isArray(file) ? file : [file];
        for (const file of uploads) {
            const result = yield cloudinary_1.default.uploader.upload(file.tempFilePath);
            ;
            const updateData = {
                hotelName,
                address,
                description,
                website,
                email,
                city,
                state: state.toLowerCase(),
                // totalRooms,
                imageId: result.secure_url
            };
            yield hotel_model_1.default.update(updateData, { where: { id: hotelId } });
            return res.status(200).json({
                message: "Updated Successfully!"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.updateHotel = updateHotel;
const hotelsInLagos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lagos = yield hotel_model_1.default.findAll({ where: { state: { [sequelize_1.Op.like]: `LAGOS` } } });
        if (!lagos) {
            return res.status(404).json({
                message: "No Hotel found!"
            });
        }
        return res.status(200).json({
            message: lagos
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.hotelsInLagos = hotelsInLagos;
const hotelsInAbuja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const abuja = yield hotel_model_1.default.findAll({ where: { state: "abuja" } });
        if (abuja.length === 0) {
            return res.status(404).json({
                message: "No Hotel found!"
            });
        }
        return res.status(200).json({
            message: abuja
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.hotelsInAbuja = hotelsInAbuja;
const hotelsInKano = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const kano = yield hotel_model_1.default.findAll({ where: { state: "kano" } });
        if (kano.length === 0) {
            return res.status(404).json({
                message: "No Hotel found!"
            });
        }
        return res.status(200).json({
            message: kano
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.hotelsInKano = hotelsInKano;
const hotelsInCalabar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const calabar = yield hotel_model_1.default.findAll({ where: { city: "calabar" } });
        if (calabar.length === 0) {
            return res.status(404).json({
                message: "No Hotel found!"
            });
        }
        return res.status(200).json({
            message: calabar
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.hotelsInCalabar = hotelsInCalabar;
const searchFunction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchValue } = req.body;
        const result = yield hotel_model_1.default.search(searchValue);
        const available = yield rooms_model_1.default.findAll({ where: { booked: false } });
        if (result.length === 0 && available.length === 0) {
            return res.status(404).json({
                message: "NO result found!"
            });
        }
        else {
            return res.status(200).json({
                message: `Heres your result for the search! ${searchValue} ` + result.length,
                data: result
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.searchFunction = searchFunction;
