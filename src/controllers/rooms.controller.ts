import Room from "../models/rooms.model";
import Cloudinary from "../utils/cloudinary";
import Hotel from "../models/hotel.model";
import Admin from "../models/admin.model";
import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";


export const registerRoom: RequestHandler = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const adminId = req.params.hotelId;
    const { roomNumber, roomDescription, price } = req.body;
    const hotelExists = await Hotel.findOne({ where: { id: hotelId } });
    if (!hotelExists) {
      return res.status(404).json({
        message: "This hotel does not exists!"
      })
    };
    if (hotelExists?.adminId !== parseInt(adminId)) {
      return res.status(400).json({
        message: "Please you are not authorized to perform this action!"
      })
    };
    const file = req.files?.image as UploadedFile[];
    if (!file) {
      throw new Error("no Image uploaded, Please add an image!")
    }
    const uploads = Array.isArray(file) ? file : [file];
    for (const file of uploads) {
      const result = await Cloudinary.uploader.upload(file.tempFilePath);
      interface roomAttributes {
        roomNumber: number;
        roomDescription: string;
        price: number;
        image: string;
        hotelId: number;
        adminId: number;
      };
      const roomData: roomAttributes = {
        roomNumber,
        roomDescription,
        price,
        image: result.secure_url,
        hotelId: Number(hotelId),
        adminId: Number(adminId)
      };
      const createRoom = await Room.create(roomData);
      if (!createRoom) {
        return res.status(400).json({
          message: "An error occcured registering your room!"
        })
      } else {
        return res.status(201).json({
          data: createRoom
        })
      }
    }

  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};