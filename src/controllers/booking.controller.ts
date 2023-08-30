import { RequestHandler, Request, Response } from "express";
import Booking from "../models/booking.model";
import Room from "../models/rooms.model";
import cron from "node-cron";
import { Op } from "sequelize";
import logger from "../utils/logger";
import { io } from "../app";
import User from "../models/user.admin";
import mailSender from "../middlewares/mailService";
import { Content } from "mailgen";
import generateMail from "../utils/mailGenerator";
import juice from "juice";
import Admin from "../models/admin.model";


export const bookAroom: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const roomId = req.params.roomId;
    const { checkIn, checkOut, adult, children, infant } = req.body;
    const theUser = await User.findAll({ where: { id: userId } });
    const bookingRoom = await Room.findByPk(roomId);

    if (!bookingRoom || bookingRoom?.booked) {
      return res.status(400).json({
        message: 'This room has already been booked! Or does not exist!'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid checkIn or checkOut date format',
      });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (checkInDate >= checkOutDate || checkInDate < currentDate) {
      return res.status(400).json({
        message: 'Invalid date range. Check-out date should be after or equal to check-in date, and check-in date should not be in the past!',
      });
    }


    //Calculate total price based on check-in, check-out, and room price
    const roomPrice = bookingRoom.price;
    interface PriceDetails {
      perNight: number;
      totalPrice: number;
    }

    const calculateTotalPrice = (checkOutDate: Date, checkInDate: Date, roomPrice: number): PriceDetails => {
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
    const sendNotify = io.emit("booking", { userId, message });
    if (!sendNotify) {
      return res.status(400).json({
        message: "An error occured sending the notification!"
      })
    };
    const today = new Date(checkOut);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const formattedCheckoutDate = `${year}-${month}-${day}`;

    const ttoday = new Date(checkIn);
    const yyear = ttoday.getFullYear();
    const mmonth = String(today.getMonth() + 1).padStart(2, '0');
    const dday = String(today.getDate()).padStart(2, '0');

    const formattedCheckinDate = `${yyear}-${mmonth}-${dday}`;

    interface book {
      checkIn: string,
      checkOut: string,
      userId: number,
      roomId: number,
      adminId: number,
      price: number,
      night: number,
      adult: number,
      username: string,
      infant: number,
      children: number,
      roomNumber: number,
      amountToPay: number,
      message: string
    }
    const bookData: book = {
      checkIn: formattedCheckinDate,
      checkOut: formattedCheckoutDate,
      userId: Number(userId),
      roomId: Number(roomId),
      price: bookingRoom.price,
      amountToPay: totalPrice.totalPrice,
      message,
      username: theUser[0].fullname.split(" ")[0],
      night: totalPrice.perNight,
      adult,
      children,
      infant,
      roomNumber: bookingRoom.roomNumber,
      adminId: bookingRoom.adminId
    };
    // console.log(bookData);


    const bookRoom = await Booking.create(bookData);
    bookingRoom.booked = true;
    bookingRoom.checkIn = formattedDate;
    bookingRoom.checkOut = formattedCheckoutDate;
    await bookingRoom.save();
    const notifyAdmin = async (booking: Booking) => {
      try {
        const admin = await Admin.findByPk(booking.adminId);
        if (!admin) {
          return logger.error('No Admin found!');
        }

        const message = `A user has booked your room (${booking.roomId}) from ${booking.checkIn} to ${booking.checkOut}.`;

        // Save the notification message to the booking model
        booking.adminMessage = message;
        await booking.save();

        // Send the notifications to the admin!
        io.to(admin.id.toString()).emit('Booked notification', { booking, message });
      } catch (error: any) {
        logger.error(error.message);
      }
    };

    notifyAdmin(bookRoom);

    //send receipt to the customers registered email!
    const emailContent: Content = {
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
    }
    const emailBody = generateMail.generate(emailContent);
    // console.log(emailBody);
    const juicedBody = juice(emailBody)
    const emailText = generateMail.generatePlaintext(emailContent);
    const mailservice = new mailSender();
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

  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};
// console.log(new Date());


const updateBookedRoom = async () => {
  try {
    const currentDate = new Date();
    const allRoomsToUpdate = await Room.findAll({
      where: {
        booked: true,
        checkOut: {
          [Op.lte]: currentDate
        }
      },
    });
    for (const book of allRoomsToUpdate) {
      book.booked = false
      book.checkIn = null
      book.checkOut = null
      await book.save()
    }
  } catch (error: any) {
    logger.error(error.mesage)
  }
};

export const schedular = cron.schedule("* * * * *", updateBookedRoom);

export const getTheNotification: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const notify = await Booking.findAll({
      where: { userId: userId },
      include: [{ model: Room }]
    });
    if (notify.length === 0) {
      return res.status(404).json({
        message: "No notifications for now!"
      });
    }
    return res.status(200).json({
      data: notify
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};


export const allBooked: RequestHandler = async (req, res) => {
  try {
    const { adminId } = req.params;
    const notify = await Booking.findAll({
      where: {
        adminId: adminId
      },
      include: [{ model: Room }]
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
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};

export const notifyAdmind = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    const notify = async (booking: Booking) => {
      const notifications = [];
      const admin = await User.findByPk(booking.adminId);
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
    }
    notify
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};


