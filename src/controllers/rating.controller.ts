import { RequestHandler } from "express";
import Rating from "../models/rating.model";
import Room from "../models/rooms.model";


export const rateAhotel: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { roomId } = req.params;
    const { rating, comment } = req.body;
    const roomTorate = await Room.findByPk(roomId)
    if (!roomTorate) {
      return res.status(404).json({
        message: `Room with this id: ${roomId} not found!`
      })
    };
    const previousRating = roomTorate.rating;
    const currentRate = previousRating + rating;
    console.log(previousRating);

    interface rate {
      rating: number,
      comment: string,
      roomId: number,
      userId: number
    };
    const rateData: rate = {
      rating: currentRate,
      comment,
      roomId: Number(roomId),
      userId: Number(userId)
    };
    const ratings = await Rating.create(rateData);
    roomTorate.rating = rating;
    roomTorate.save();
    if (!ratings) {
      return res.status(400).json({
        message: "An error occured while rating this room!"
      })
    } else {
      return res.status(201).json({
        data: ratings
      })
    };
  } catch (error: any) {
    return res.status(500).json({
      message: error.messge
    })
  }
};