import Room from "../models/rooms.model";
import Cloudinary from "../utils/cloudinary";
import Hotel from "../models/hotel.model";
import { RequestHandler } from "express";
import { UploadedFile } from "express-fileupload";
import { Op } from "sequelize";
import sequelize from "../config/config";


export const registerRoom: RequestHandler = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const adminId = req.params.adminId;
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
      return res.status(400).json({ message: "no Image uploaded, Please add an image!" })
    };

    const uploads = Array.isArray(file) ? file : [file];
    for (const file of uploads) {
      const result = await Cloudinary.uploader.upload(file.tempFilePath);
      interface roomAttributes {
        roomNumber: number;
        roomDescription: string;
        price: number;
        image: string;
        cloudId: string;
        address: string;
        hotelname: string;
        hotelId: number;
        adminId: number;
      };
      const roomData: roomAttributes = {
        roomNumber,
        roomDescription,
        price,
        image: result.secure_url,
        cloudId: result.public_id,
        address: hotelExists.address,
        hotelname: hotelExists.hotelName,
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
    };

  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};


export const allRooms: RequestHandler = async (req, res) => {
  try {
    const all = await Room.findAll({
      order: sequelize.random(),
      where: { booked: false }
    });
    if (all.length === 0) {
      return res.status(404).json({
        message: "Sorry no rooms available for the moment!"
      })
    } else {
      return res.status(200).json({
        messge: "All rooms : " + all.length,
        data: all
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};


export const cheapHotelRooms: RequestHandler = async (req, res) => {
  try {
    const cheapRoom = await Room.findAll({
      where: {
        price: {
          [Op.lte]: 20000
        },
        booked: false
      },
      order: sequelize.random()
    });
    if (cheapRoom.length === 0) {
      return res.status(404).json({
        message: "No room found!"
      })
    } else {
      return res.status(200).json({
        data: cheapRoom
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};

export const fourStarRooms: RequestHandler = async (req, res) => {
  try {
    const niceRoom = await Room.findAll({
      where: {
        price: { [Op.gte]: 20000, [Op.lte]: 100000 },
        booked: false
      },
      order: sequelize.random()
    });
    if (niceRoom.length === 0) {
      return res.status(404).json({
        message: "No room found!"
      })
    }
    return res.status(200).json({
      message: "All 4 star rooms " + niceRoom.length,
      data: niceRoom
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};

export const luxuryRooms: RequestHandler = async (req, res) => {
  try {
    const luxury = await Room.findAll(
      {
        where: {
          price: { [Op.gte]: 80000 },
          booked: false
        },
        order: sequelize.random()
      });
    if (luxury.length === 0) {
      return res.status(400).json({
        message: "No Expensive rooms for now!"
      })
    } else {
      return res.status(200).json({
        message: "All Luxury rooms " + luxury.length,
        data: luxury
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};


export const roomDetail: RequestHandler = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const theRoom = await Room.findByPk(roomId);
    if (!theRoom) {
      return res.status(404).json({
        data: theRoom
      })
    }
    return res.status(200).json({
      mesaage: "the Room",
      data: theRoom
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};


export const allAdminRooms: RequestHandler = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const allRooms = await Room.findAll({
      where: { adminId }
    });
    if (!allRooms) {
      return res.status(404).json({
        message: "No room found!"
      })
    } else {
      return res.status(200).json({
        message: "All Admin Rooms",
        length: allRooms.length,
        data: allRooms
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};

export const deleteRoom: RequestHandler = async (req, res) => {
  try {
    const roomId = req.params.id;
    const theRoom = await Room.findByPk(roomId);
    if (!theRoom) {
      return res.status(404).json({
        message: "This room does not Exist!"
      })
    }
    await Cloudinary.uploader.destroy(theRoom.cloudId);
    await Room.destroy({ where: { id: roomId } });
    return res.status(200).json({
      message: "Deleted success!"
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
}