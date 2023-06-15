import { RequestHandler } from "express";
import User from "../models/user.admin";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import mailSender from "../middlewares/mailService";


export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { fullname, password, email, phoneNumber } = req.body;
    const newEmail = await User.findOne({ where: { email: email } });
    if (newEmail) {
      return res.status(400).json({
        message: "Email already taken."
      })
    }
    const saltPassword = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, saltPassword);
    type userAttributes = {
      fullname: string;
      email: string;
      password: string;
      phoneNumber: number
    }
    const userData: userAttributes = {
      fullname,
      email,
      password: hassPassword,
      phoneNumber
    };
    const userToCreate = new User(userData);
    const generateToken = Jwt.sign({
      isAdmin: userToCreate.phoneNumber,
      id: userToCreate.id
    }, <string>process.env.JWT_TOK, {
      expiresIn: "1d"
    });
    userToCreate.token = generateToken;
    const verify = `${req.protocol}://${req.get("host")}/api/change/${userToCreate.id}`;
    const message = `Hello cheif ${userToCreate.fullname} Kindly use the link to change your password  ${verify}`;
    const mailservice = new mailSender();
    mailservice.createConnection();
    mailservice.mail({
      from: process.env.EMAIL,
      email: userToCreate.email,
      subject: "Kindly verify email.",
      message
    })
    await userToCreate.save();
    return res.status(201).json({
      message: "Registration successful.",
      data: userToCreate
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
}; 