import Hotel from "../models/hotel.model";
import { RequestHandler } from "express";
import { UploadedFile } from 'express-fileupload';
import Admin from "../models/admin.model";
import Cloudinary from "../utils/cloudinary";



export const registerHotel: RequestHandler = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const { hotelName, address, description, website, email, city, state } = req.body;
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
          email: string,
          city: string,
          state: string
        };
        const data: hotelAttributes = {
          hotelName: hotelName.toUpperCase(),
          address,
          description,
          website,
          email,
          city,
          state,
          imageId: result.secure_url,
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
    const hotelInDB = await Hotel.findAll({ where: { id: hotelId } });
    if (hotelInDB.length == 0) {
      return res.status(404).json({
        message: `No hotel with this id: ${hotelId}`
      })
    } else {
      return res.status(200).json({
        message: `Here is ${hotelInDB[0].hotelName}`,
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
    const { hotelName, address, description, website, email, city, state } = req.body;
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
        state: string
      };
      const updateData: hotelAttributes = {
        hotelName,
        address,
        description,
        website,
        email,
        city,
        state,
        imageId: result.secure_url
      };
      const updated = await Hotel.update(updateData, { where: { id: hotelId } });
      return res.status(200).json({
        message: "Updated Successfully!",
        data: updated
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
}