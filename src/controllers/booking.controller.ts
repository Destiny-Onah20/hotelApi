import { RequestHandler, Request, Response } from "express";
import Booking from "../models/booking.model";
import Room from "../models/rooms.model";
import cron from "node-cron";
import { Op } from "sequelize";
import logger from "../utils/logger";
import { io } from "../app";
import User from "../models/user.admin";


export const bookAroom: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const roomId = req.params.roomId;
    const { checkIn, checkOut } = req.body;
    const bookingRoom = await Room.findByPk(roomId);
    if (!bookingRoom || bookingRoom?.booked) {
      return res.status(400).json({
        message: 'This room has already been booked! Or does not exists!'
      })
    };
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid checkIn or checkOut date format',
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        message: 'Invalid date range. checkOut date should be after checkIn date!',
      });
    }
    const message = `You have successfully booked room number : ${bookingRoom.roomNumber}.`;
    const sendNotify = io.emit("booking", { userId, message });
    if (!sendNotify) {
      return res.status(400).json({
        message: "An error occured sending the notification!"
      })
    }
    interface book {
      checkIn: Date,
      checkOut: Date,
      userId: number,
      roomId: number,
      adminId: number,
      message: string
    }
    const bookData: book = {
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      userId: Number(userId),
      roomId: Number(roomId),
      message,
      adminId: bookingRoom.adminId
    }
    const bookRoom = await Booking.create(bookData);
    bookingRoom.booked = true;
    bookingRoom.checkIn = new Date(checkIn);
    bookingRoom.checkOut = new Date(checkOut);
    await bookingRoom.save();
    const notifyAdmin = async (booking: Booking) => {
      try {
        const admin = await User.findByPk(booking.adminId)
        if (!admin) {
          return logger.error("No Admin found!");
        };
        //customize the notification message!
        const message = `A user has booked your room (${booking.roomId}) from ${booking.checkIn} to ${booking.checkOut}.`;
        //send the notifications to the admin!
        io.to(admin.id.toString()).emit("Booked notification", { booking, message });
      } catch (error: any) {
        logger.error(error.mesage)
      }
    };
    notifyAdmin(bookRoom)
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
      where: { adminId: adminId },
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

