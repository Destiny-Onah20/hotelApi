import { RequestHandler } from "express";
import Booking from "../models/booking.model";
import Room from "../models/rooms.model";


export const bookAroom: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const roomId = req.params.roomId;
    const { checkIn, checkOut } = req.body;
    const bookingRoom = await Room.findByPk(roomId);
    if (!bookingRoom || bookingRoom?.booked) {
      return res.status(400).json({
        message: 'THis room has already been booked! Or does not exists!'
      })
    };
    interface book {
      checkIn: Date,
      checkOut: Date,
      userId: number,
      roomId: number
    }
    const bookData: book = {
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      userId: Number(userId),
      roomId: Number(roomId)
    }
    const bookRoom = await Booking.create(bookData);
    bookingRoom.booked = true;
    await bookingRoom.save();
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
console.log(new Date("2023-07-16"));