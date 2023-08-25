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
exports.notifyAdmind = exports.allBooked = exports.getTheNotification = exports.schedular = exports.bookAroom = void 0;
const booking_model_1 = __importDefault(require("../models/booking.model"));
const rooms_model_1 = __importDefault(require("../models/rooms.model"));
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../utils/logger"));
const app_1 = require("../app");
const user_admin_1 = __importDefault(require("../models/user.admin"));
const mailService_1 = __importDefault(require("../middlewares/mailService"));
const mailGenerator_1 = __importDefault(require("../utils/mailGenerator"));
const juice_1 = __importDefault(require("juice"));
const bookAroom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const roomId = req.params.roomId;
        const { checkIn, checkOut, adult, children, infant } = req.body;
        const theUser = yield user_admin_1.default.findAll({ where: { id: userId } });
        const bookingRoom = yield rooms_model_1.default.findByPk(roomId);
        if (!bookingRoom || (bookingRoom === null || bookingRoom === void 0 ? void 0 : bookingRoom.booked)) {
            return res.status(400).json({
                message: 'This room has already been booked! Or does not exists!'
            });
        }
        ;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({
                message: 'Invalid checkIn or checkOut date format',
            });
        }
        const currentDate = new Date();
        // console.log(currentDate);
        if (checkInDate > checkOutDate || checkInDate < currentDate) {
            return res.status(400).json({
                message: 'Invalid date range. checkOut date should be after checkIn date!',
            });
        }
        ;
        //Calculate total price based on check-in, check-out, and room price
        const roomPrice = bookingRoom.price;
        const calculateTotalPrice = (checkOutDate, checkInDate, roomPrice) => {
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const durationInMillis = checkOutDate.getTime() - checkInDate.getTime();
            const numberOfDays = durationInMillis / millisecondsPerDay;
            // Round up the number of days to handle partial days
            const perNight = Math.ceil(numberOfDays);
            const price = perNight * roomPrice;
            return {
                perNight: perNight,
                totalPrice: price,
            };
        };
        const totalPrice = calculateTotalPrice(checkOutDate, checkInDate, roomPrice);
        const message = `You have successfully booked room number : ${bookingRoom.roomNumber}.`;
        const sendNotify = app_1.io.emit("booking", { userId, message });
        if (!sendNotify) {
            return res.status(400).json({
                message: "An error occured sending the notification!"
            });
        }
        ;
        const bookData = {
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            userId: Number(userId),
            roomId: Number(roomId),
            price: bookingRoom.price,
            amountToPay: totalPrice.totalPrice,
            message,
            night: totalPrice.perNight,
            adult,
            children,
            infant,
            roomNumber: bookingRoom.roomNumber,
            adminId: bookingRoom.adminId
        };
        // console.log(bookData);
        const bookRoom = yield booking_model_1.default.create(bookData);
        bookingRoom.booked = true;
        bookingRoom.checkIn = new Date(checkIn);
        bookingRoom.checkOut = new Date(checkOut);
        yield bookingRoom.save();
        const notifyAdmin = (booking) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const admin = yield user_admin_1.default.findByPk(booking.adminId);
                if (!admin) {
                    return logger_1.default.error("No Admin found!");
                }
                ;
                //customize the notification message!
                const message = `A user has booked your room (${booking.roomId}) from ${booking.checkIn} to ${booking.checkOut}.`;
                //send the notifications to the admin!
                app_1.io.to(admin.id.toString()).emit("Booked notification", { booking, message });
            }
            catch (error) {
                logger_1.default.error(error.mesage);
            }
        });
        notifyAdmin(bookRoom);
        //send receipt to the customers registered email!
        const emailContent = {
            body: {
                name: ` ${theUser[0].fullname}`,
                intro: `Thank you for booking a room with us. Attached is your payment receipt.`,
                table: {
                    data: [
                        { key: "Fullname:", value: theUser[0].fullname.toString() },
                        { key: "Check-in:", value: bookData.checkIn.toString() },
                        { key: "Check-out:", value: bookData.checkOut.toString() },
                        { key: "Room Number:", value: bookData.roomNumber.toString() },
                        { key: "Room #Id:", value: bookData.roomId.toString() },
                        { key: "price:", value: `₦ ${bookData.price.toString()}` },
                        { key: "Hotel:", value: ` ${bookingRoom.hotelname.toString()}` },
                        { key: "Address:", value: ` ${bookingRoom.address.toString()}` },
                        { key: "Nights:", value: ` ${totalPrice.perNight.toString()} Nights` },
                        { key: "Amount To Pay :", value: `₦ ${bookData.amountToPay.toString()}` },
                    ],
                    columns: {
                        customWidth: {
                            key: '20%',
                            value: '80%',
                        },
                        customAlignment: {
                            key: 'left',
                            value: 'right',
                        },
                    }
                }
            }
        };
        const emailBody = mailGenerator_1.default.generate(emailContent);
        // console.log(emailBody);
        const juicedBody = (0, juice_1.default)(emailBody);
        const emailText = mailGenerator_1.default.generatePlaintext(emailContent);
        const mailservice = new mailService_1.default();
        mailservice.createConnection();
        mailservice.mail({
            from: {
                address: process.env.EMAIL
            },
            email: theUser[0].email,
            subject: "Receipt for payment!",
            message: emailText,
            html: emailBody,
        });
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
// console.log(new Date());
const updateBookedRoom = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDate = new Date();
        const allRoomsToUpdate = yield rooms_model_1.default.findAll({
            where: {
                booked: true,
                checkOut: {
                    [sequelize_1.Op.lte]: currentDate
                }
            },
        });
        for (const book of allRoomsToUpdate) {
            book.booked = false;
            book.checkIn = null;
            book.checkOut = null;
            yield book.save();
        }
    }
    catch (error) {
        logger_1.default.error(error.mesage);
    }
});
exports.schedular = node_cron_1.default.schedule("* * * * *", updateBookedRoom);
const getTheNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const notify = yield booking_model_1.default.findAll({
            where: { userId: userId },
            include: [{ model: rooms_model_1.default }]
        });
        if (notify.length === 0) {
            return res.status(404).json({
                message: "No notifications for now!"
            });
        }
        return res.status(200).json({
            data: notify
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.getTheNotification = getTheNotification;
const allBooked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const notify = yield booking_model_1.default.findAll({
            where: {
                adminId: adminId
            },
            include: [{ model: rooms_model_1.default }]
        });
        // const notify = await Room.findAll({
        //   where: {
        //     adminId,
        //     booked: true
        //   },
        //   include: [Booking]
        // })
        if (notify.length === 0) {
            return res.status(400).json({
                message: "No notifications for now!"
            });
        }
        return res.status(200).json({
            data: notify
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.allBooked = allBooked;
const notifyAdmind = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const notify = (booking) => __awaiter(void 0, void 0, void 0, function* () {
            const notifications = [];
            const admin = yield user_admin_1.default.findByPk(booking.adminId);
            if (!admin) {
                console.log('Admin user not found');
                return;
            }
            const notificationData = {
                adminId,
                bookingId: booking.id,
                roomId: booking.roomId,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                message: `A user has booked your room (${booking.roomId}) from ${booking.checkIn} to ${booking.checkOut}.`,
            };
            notifications.push(notificationData);
            const adminNotifications = notifications.filter((notification) => notification.adminId === adminId);
            if (adminNotifications.length === 0) {
                return res.status(404).json({
                    message: "No Notifications for now!"
                });
            }
            return res.status(200).json({
                data: adminNotifications
            });
        });
        notify;
    }
    catch (error) {
        return res.status(500).json({
            message: error.mesage
        });
    }
});
exports.notifyAdmind = notifyAdmind;
