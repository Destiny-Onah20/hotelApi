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
exports.allAdminRoomsBooked = exports.getAllRoomsByAdmin = exports.allAdminHotels = exports.changePassword = exports.forgetPassword = exports.verifyAdmin = exports.loginAdmin = exports.registerAdmin = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailService_1 = __importDefault(require("../middlewares/mailService"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const mailGenerator_1 = __importDefault(require("../utils/mailGenerator"));
"#2db9ff";
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, password, email } = req.body;
        const checkAdmin = yield admin_model_1.default.findOne({ where: { email: email } });
        if (checkAdmin) {
            return res.status(400).json({
                message: "Email already taken."
            });
        }
        const saltPassword = yield bcrypt_1.default.genSalt(10);
        const hassPassword = yield bcrypt_1.default.hash(password, saltPassword);
        const data = {
            name: name.toUpperCase(),
            password: hassPassword,
            email
        };
        const creatingData = new admin_model_1.default(data);
        const generateToken = jsonwebtoken_1.default.sign({
            isAdmin: creatingData.isAdmin,
            id: creatingData.id
        }, process.env.JWT_TOK, {
            expiresIn: "1d"
        });
        creatingData.token = generateToken;
        yield creatingData.save();
        const verifyAccountRoute = `https://hotel-youngmentor.vercel.app/#/adminverify/747747`;
        const emailContent = {
            body: {
                name: `${creatingData.name}`,
                intro: `Welcome to our site! Please verify your account by clicking the button below:`,
                action: {
                    instructions: 'To verify your account, please click the button below:',
                    button: {
                        color: '#2db9ff',
                        text: 'Verify Account',
                        link: verifyAccountRoute,
                    },
                },
                outro: 'If you did not sign up for our site, you can ignore this email.',
            },
        };
        const emailBody = mailGenerator_1.default.generate(emailContent);
        const emailText = mailGenerator_1.default.generatePlaintext(emailContent);
        const mailservice = new mailService_1.default();
        mailservice.createConnection();
        mailservice.mail({
            from: process.env.EMAIL,
            email: creatingData.email,
            subject: "Kindly verify!",
            message: emailText,
            html: emailBody
        });
        return res.status(201).json({
            message: "Admin created successfully.",
            data: creatingData
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.registerAdmin = registerAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const checkAdmin = yield admin_model_1.default.findOne({ where: { email: email } });
        if (!checkAdmin) {
            return res.status(400).json({
                message: "Email and password does not match."
            });
        }
        const verifyPassword = yield bcrypt_1.default.compare(password, checkAdmin.password);
        if (!verifyPassword) {
            return res.status(400).json({
                message: "Email and password does not match."
            });
        }
        else {
            const generateToken = jsonwebtoken_1.default.sign({
                isAdmin: checkAdmin.isAdmin,
                id: checkAdmin.id
            }, process.env.JWT_TOK, {
                expiresIn: "1d"
            });
            checkAdmin.token = generateToken;
            yield checkAdmin.save();
            return res.status(201).json({
                message: "Successfully logged in.",
                data: checkAdmin
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.loginAdmin = loginAdmin;
const verifyAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const authAdmin = yield admin_model_1.default.findOne({ where: { id: adminId } });
        if (!authAdmin) {
            return res.status(400).json({
                message: "This Admin does not exists."
            });
        }
        yield admin_model_1.default.update({
            verify: true
        }, { where: { id: adminId } });
        return res.status(200).json({
            message: "Account verified"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.verifyAdmin = verifyAdmin;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const validEmail = yield admin_model_1.default.findOne({ where: { email: email } });
        if (!validEmail) {
            return res.status(404).json({
                message: "PLease provide a registered Email address."
            });
        }
        const verifyAccountRoute = `https://hotel-youngmentor.vercel.app/#/userverify/747747`;
        const emailContent = {
            body: {
                name: `${validEmail.name}`,
                intro: `You have requested to reset your password. Please click the button below to proceed:`,
                action: {
                    instructions: 'To reset your password, please click the button below:',
                    button: {
                        color: '#2db9ff',
                        text: 'Reset Password',
                        link: verifyAccountRoute,
                    },
                },
                outro: 'If you did not sign up for our site, you can ignore this email.',
            },
        };
        const emailBody = mailGenerator_1.default.generate(emailContent);
        const emailText = mailGenerator_1.default.generatePlaintext(emailContent);
        const mailservice = new mailService_1.default();
        mailservice.createConnection();
        mailservice.mail({
            from: process.env.EMAIL,
            email: validEmail.email,
            subject: "Reset Password!",
            message: emailText,
            html: emailBody
        });
        return res.status(200).json({
            message: "A link to change your password have been sent to your email, Please check!."
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.forgetPassword = forgetPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const { password, confirmPassword } = req.body;
        const matchedPassword = confirmPassword.match(password);
        if (!matchedPassword) {
            return res.status(400).json({
                message: "Password does not match."
            });
        }
        const saltPassword = yield bcrypt_1.default.genSalt(10);
        const hassPassword = yield bcrypt_1.default.hash(password, saltPassword);
        yield admin_model_1.default.update({ password: hassPassword }, { where: { id: adminId } });
        return res.status(200).json({
            message: "Password changed successfully!"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.changePassword = changePassword;
const allAdminHotels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.adminId;
        const adminDetails = yield admin_model_1.default.findByPk(adminId, {
            include: [hotel_model_1.default]
        });
        if (!adminDetails) {
            return res.status(404).json({
                mesage: `Manager with this id: ${adminId} not found!`
            });
        }
        else {
            return res.status(200).json({
                data: adminDetails
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.allAdminHotels = allAdminHotels;
const getAllRoomsByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const theAdminRoom = yield rooms_model_1.default.findAll({
            where: {
                adminId
            }
        });
        if (!theAdminRoom) {
            return res.status(404).json({
                message: 'No room Found!'
            });
        }
        return res.status(200).json({
            message: `All rooms Registered by ${adminId} ${theAdminRoom.length} `,
            data: theAdminRoom
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.getAllRoomsByAdmin = getAllRoomsByAdmin;
const allAdminRoomsBooked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const allRooms = yield booking_model_1.default.findAll({
            where: { adminId },
            include: [rooms_model_1.default]
        });
        if (allRooms.length === 0) {
            return res.status(404).json({
                message: `No room booked by this user: ${adminId}`
            });
        }
        else {
            return res.status(200).json({
                message: `all the rooms booked ${allRooms.length}`,
                data: allRooms
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.allAdminRoomsBooked = allAdminRoomsBooked;
