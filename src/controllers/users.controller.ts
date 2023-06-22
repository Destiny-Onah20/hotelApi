import { RequestHandler } from "express";
import User from "../models/user.admin";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import mailSender from "../middlewares/mailService";


export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber } = req.body;
    const unusedEmail = await User.findOne({ where: { email: email } });
    if (unusedEmail) {
      return res.status(400).json({
        message: "Wmail already taken!"
      })
    }
    const saltPassword = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, saltPassword);
    interface UserAttribute {
      fullname: string,
      password: string,
      email: string,
      phoneNumber: number
    };
    const data: UserAttribute = {
      fullname,
      email,
      password: hassPassword,
      phoneNumber
    };
    const userToCreate = new User(data);
    const generateToken = Jwt.sign({
      id: userToCreate.id,
      fullname: userToCreate.fullname
    }, <string>process.env.JWT_TOK, {
      expiresIn: "1d"
    });
    userToCreate.token = generateToken;
    await userToCreate.save();
    const verifyAccountRoute = `${req.protocol}://${req.get("host")}/api/v1/verify/${userToCreate.id}`;
    const message = `Hello cheif ${userToCreate.fullname} Kindly use the link to verify your account  ${verifyAccountRoute}`;
    const mailservice = new mailSender();
    mailservice.createConnection();
    mailservice.mail({
      from: process.env.EMAIL,
      email: userToCreate.email,
      subject: "Kindly verify!",
      message
    });
    res.status(201).json({
      message: "Created Successfully.",
      data: userToCreate
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,

    })
  }
}; 