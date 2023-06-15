import { RequestHandler } from "express";
import Admin from "../models/admin.model";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";


export const registerAdmin: RequestHandler = async (req, res): Promise<object> => {
  try {
    const { hotelName, password, email } = req.body;
    const checkAdmin = await Admin.findOne({ where: { email: email } });
    if (checkAdmin) {
      return res.status(400).json({
        message: "hotelName already taken."
      })
    }
    const saltPassword = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, saltPassword);
    type AdminAttribute = {
      hotelName: string,
      password: string,
      email: string
    }
    const data: AdminAttribute = {
      hotelName,
      password: hassPassword,
      email
    };
    const creatingData = new Admin(data);
    const generateToken = Jwt.sign({
      isAdmin: creatingData.isAdmin,
      id: creatingData.id
    }, <string>process.env.JWT_TOK, {
      expiresIn: "1d"
    })
    creatingData.token = generateToken;
    await creatingData.save();
    return res.status(201).json({
      message: "Admin created successfully.",
      data: creatingData
    })

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const loginAdmin: RequestHandler = async (req, res): Promise<object> => {
  try {
    const { email, password } = req.body;
    const checkAdmin = await Admin.findOne({ where: { email: email } });
    if (!checkAdmin) {
      return res.status(400).json({
        message: "hotelname and password does not match."
      })
    }
    const verifyPassword = await bcrypt.compare(password, checkAdmin.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "hotelname and password does not match."
      })
    } else {
      const generateToken = Jwt.sign({
        isAdmin: checkAdmin.isAdmin,
        id: checkAdmin.id
      }, <string>process.env.JWT_TOK, {
        expiresIn: "1d"
      })
      checkAdmin.token = generateToken;
      await checkAdmin.save();
      return res.status(201).json({
        message: "Successfully logged in.",
        data: checkAdmin
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};