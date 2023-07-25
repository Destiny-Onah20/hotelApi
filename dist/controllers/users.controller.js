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
exports.roomsBookedByUser = exports.facebookSignUp = exports.changePasswordUser = exports.forgottenPassword = exports.verifyUser = exports.loginUser = exports.registerUser = void 0;
const user_admin_1 = __importDefault(require("../models/user.admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_facebook_1 = require("passport-facebook");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailService_1 = __importDefault(require("../middlewares/mailService"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const mailGenerator_1 = __importDefault(require("../utils/mailGenerator"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, email, password, phoneNumber } = req.body;
        const unusedEmail = yield user_admin_1.default.findOne({ where: { email: email } });
        if (unusedEmail) {
            return res.status(400).json({
                message: "Email already taken!"
            });
        }
        const saltPassword = yield bcrypt_1.default.genSalt(10);
        const hassPassword = yield bcrypt_1.default.hash(password, saltPassword);
        const data = {
            fullname,
            email,
            password: hassPassword,
            phoneNumber
        };
        const userToCreate = new user_admin_1.default(data);
        const generateToken = jsonwebtoken_1.default.sign({
            id: userToCreate.id,
            fullname: userToCreate.fullname
        }, process.env.JWT_TOK, {
            expiresIn: "1d"
        });
        userToCreate.token = generateToken;
        yield userToCreate.save();
        const verifyAccountRoute = `https://hotel-youngmentor.vercel.app/#/userverify/747747`;
        const emailContent = {
            body: {
                name: `${userToCreate.fullname}`,
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
            email: userToCreate.email,
            subject: "Kindly verify!",
            message: emailText,
            html: emailBody
        });
        res.status(201).json({
            message: "Created Successfully.",
            data: userToCreate
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const authEmail = yield user_admin_1.default.findOne({ where: { email: email } });
        if (!authEmail) {
            return res.status(400).json({
                message: "Email or password doesn't match!"
            });
        }
        const authPassword = yield bcrypt_1.default.compare(password, authEmail.password);
        if (!authPassword) {
            return res.status(400).json({
                message: "Email or password doesn't match!"
            });
        }
        const generateToken = jsonwebtoken_1.default.sign({
            id: authEmail.id,
            fullname: authEmail.fullname
        }, process.env.JWT_TOK, {
            expiresIn: "1d"
        });
        authEmail.token = generateToken;
        yield authEmail.save();
        return res.status(200).json({
            message: "Loggin Success!",
            data: authEmail
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.loginUser = loginUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const authUser = yield user_admin_1.default.findOne({ where: { id: userId } });
        if (!authUser) {
            return res.status(400).json({
                message: "This user does not exists."
            });
        }
        yield user_admin_1.default.update({
            verify: true
        }, { where: { id: userId } });
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
exports.verifyUser = verifyUser;
const forgottenPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const validEmail = yield user_admin_1.default.findOne({ where: { email: email } });
        if (!validEmail) {
            return res.status(400).json({
                message: "Email inputed does not exist!"
            });
        }
        const regexValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const validateEmail = email.match(regexValidation);
        if (!validateEmail) {
            return res.status(400).json({
                message: "Invalid Email format!"
            });
        }
        const verifyAccountRoute = `https://hotel-youngmentor.vercel.app/#/userverify/747747`;
        const emailContent = {
            body: {
                signature: "Sincerely",
                name: `${validEmail.fullname}`,
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
            message: "Please check your mail for forgotten password mail!"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.forgottenPassword = forgottenPassword;
const changePasswordUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { password, confirmPassword } = req.body;
        const matchedPassword = password.match(confirmPassword);
        if (!matchedPassword) {
            return res.status(400).json({
                message: "Password does not match, please check and confirm!"
            });
        }
        ;
        const saltPassword = yield bcrypt_1.default.genSalt(9);
        const hassPassword = yield bcrypt_1.default.hash(password, saltPassword);
        yield user_admin_1.default.update({ password: hassPassword }, {
            where: {
                id: userId
            }
        });
        return res.status(200).json({
            message: "Password changed successful!"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.changePasswordUser = changePasswordUser;
const facebookSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.use(new passport_facebook_1.Strategy({
            clientID: process.env.FACE_APP_ID,
            clientSecret: process.env.FACE_APP_SEC,
            callbackURL: "http://localhost:2000/auth/facebook/"
        }, function (accessToken, refreshToken, profile, callback) {
            var _a, _b, _c, _d;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let newEmail = yield user_admin_1.default.findOne({ where: { email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value } });
                    if (newEmail) {
                        return res.status(400).json({
                            message: "U already have an account!"
                        });
                    }
                    ;
                    const userPhoneNumber = (_c = (_b = profile._json) === null || _b === void 0 ? void 0 : _b.phone) === null || _c === void 0 ? void 0 : _c.number;
                    const saltPassword = yield bcrypt_1.default.genSalt(10);
                    const hassPassword = yield bcrypt_1.default.hash("", saltPassword);
                    const data = {
                        fullname: profile.displayName,
                        email: (_d = profile.emails) === null || _d === void 0 ? void 0 : _d[0].value,
                        password: hassPassword,
                        phoneNumber: userPhoneNumber
                    };
                    const userToCreate = new user_admin_1.default(data);
                    const generateToken = jsonwebtoken_1.default.sign({
                        id: userToCreate.id,
                        fullname: userToCreate.fullname
                    }, process.env.JWT_TOK, {
                        expiresIn: "1d"
                    });
                    userToCreate.token = generateToken;
                    newEmail = yield userToCreate.save();
                    if (profile.emails && profile.emails.length > 0) {
                        const verifyAccountRoute = `${req.protocol}://${req.get("host")}/api/v1/verify/${userToCreate.id}`;
                        const message = `Hello cheif ${userToCreate.fullname} Kindly use the link to verify your account  ${verifyAccountRoute}`;
                        const mailservice = new mailService_1.default();
                        mailservice.createConnection();
                        mailservice.mail({
                            from: process.env.EMAIL,
                            email: userToCreate.email,
                            subject: "Kindly verify!",
                            message,
                            html: ""
                        });
                    }
                    return callback(null, newEmail);
                }
                catch (error) {
                    return callback(error);
                }
            });
        }));
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "Failed"
        });
    }
});
exports.facebookSignUp = facebookSignUp;
const roomsBookedByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const allRooms = yield booking_model_1.default.findAll({
            where: { userId },
            include: [rooms_model_1.default]
        });
        if (allRooms.length === 0) {
            return res.status(404).json({
                message: `No room booked by this user: ${userId}`
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
exports.roomsBookedByUser = roomsBookedByUser;
