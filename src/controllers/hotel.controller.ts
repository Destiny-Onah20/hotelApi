import Hotel from "../models/hotel.model";
import { RequestHandler } from "express";
import { UploadedFile } from 'express-fileupload';
import Admin from "../models/admin.model";
import Cloudinary from "../utils/cloudinary";
import Room from "../models/rooms.model";



export const registerHotel: RequestHandler = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const { hotelName, address, description, website, totalRooms, email, city, state } = req.body;
    const validAdmin = await Admin.findOne({ where: { id: adminId } });
    if (!validAdmin) {
      return res.status(400).json({
        message: "Please register yourself first!"
      })
    };
    const file = req.files?.imageId as UploadedFile[];
    if (!file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    } else {

      const uploads = Array.isArray(file) ? file : [file];
      for (const file of uploads) {
        const result = await Cloudinary.uploader.upload(file.tempFilePath)
        interface hotelAttributes {
          hotelName: string,
          address: string,
          description: string,
          website: string,
          adminId: number,
          imageId: string,
          cloudId: string,
          email: string,
          city: string,
          state: string,
          totalRooms: number;
        };
        const data: hotelAttributes = {
          hotelName: hotelName.toUpperCase(),
          address,
          description,
          website,
          email,
          city,
          state,
          totalRooms,
          imageId: result.secure_url,
          cloudId: result.public_id,
          adminId: Number(adminId)
        };
        const createHotel = await Hotel.create(data);
        return res.status(201).json({
          message: "Hotel Registered.",
          data: createHotel
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const allHotels: RequestHandler = async (req, res) => {
  try {
    const hotels = await Hotel.findAll();
    if (hotels.length === 0) {
      return res.status(404).json({
        message: "Sorry no hotels for now!"
      })
    } else {
      return res.status(200).json({
        message: "All hotels " + hotels.length,
        data: hotels
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const hotelDetails: RequestHandler = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const hotelInDB = await Hotel.findByPk(hotelId, {
      include: [Room]
    });
    if (!hotelInDB) {
      return res.status(404).json({
        message: `No hotel with this id: ${hotelId}`
      })
    } else {
      return res.status(200).json({
        message: `Here is ${hotelInDB.hotelName}`,
        data: hotelInDB
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};


export const updateHotel: RequestHandler = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const adminId = req.params.adminId;
    const { hotelName, address, description, website, email, totalRooms, city, state } = req.body;
    const hotelToUpdate = await Hotel.findOne({ where: { id: hotelId } });
    if (hotelToUpdate?.adminId !== parseInt(adminId)) {
      return res.status(401).json({
        message: "You are not authorized to perform this action!"
      })
    };
    const file = req.files?.imageId as UploadedFile[];
    const uploads = Array.isArray(file) ? file : [file];
    for (const file of uploads) {
      const result = await Cloudinary.uploader.upload(file.tempFilePath);
      interface hotelAttributes {
        hotelName: string,
        address: string,
        description: string,
        website: string,
        imageId: string,
        email: string,
        city: string,
        state: string,
        totalRooms: number;
      };
      const updateData: hotelAttributes = {
        hotelName,
        address,
        description,
        website,
        email,
        city,
        state,
        totalRooms,
        imageId: result.secure_url
      };
      await Hotel.update(updateData, { where: { id: hotelId } });
      return res.status(200).json({
        message: "Updated Successfully!"
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};


export const HotelsbySearch: RequestHandler = async (req, res) => {
  try {
    const { location } = req.body
    const theSearch = await Hotel.findAll({ where: { state: location } });
    if (!theSearch) {
      return res.status(404).json({
        message: "No Hotel found!"
      })
    }
    return res.status(200).json({
      message: theSearch
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const searchFunction: RequestHandler = async (req, res) => {
  try {
    const { searchValue } = req.body;
    const result = await Hotel.search(searchValue);
    const available = await Room.findAll({ where: { booked: false } })
    if (result.length === 0 && available.length === 0) {
      return res.status(404).json({
        message: "NO result found!"
      })
    } else {
      return res.status(200).json({
        message: `Heres your result for the search! ${searchValue} ` + result.length,
        data: result
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.mesage
    })
  }
};