import { RequestHandler } from "express";
import Admin from "../models/admin.model";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import mailSender from "../middlewares/mailService";
import Hotel from "../models/hotel.model";


export const registerAdmin: RequestHandler = async (req, res): Promise<object> => {
  try {
    const { hotelName, password, email } = req.body;
    const checkAdmin = await Admin.findOne({ where: { email: email } });
    if (checkAdmin) {
      return res.status(400).json({
        message: "Email already taken."
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
      hotelName: hotelName.toUpperCase(),
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
    });

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
        message: "Email and password does not match."
      })
    }
    const verifyPassword = await bcrypt.compare(password, checkAdmin.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "Email and password does not match."
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


export const forgetPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const validEmail = await Admin.findOne({ where: { email: email } });
    if (!validEmail) {
      return res.status(404).json({
        message: "PLease provide a registered Email address."
      })
    }
    const verify = `${req.protocol}://${req.get("host")}/api/manager/change/${validEmail.id}`;
    const message = `Hello cheif ${validEmail.hotelName} Kindly use the link to change your password  ${verify}`;
    const mailservice = new mailSender();
    mailservice.createConnection();
    mailservice.mail({
      from: process.env.EMAIL,
      email: validEmail.email,
      subject: "Forgotten password!",
      message
    })
    return res.status(200).json({
      message: "A link to change your password have been sent to your email, Please check!."
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const changePassword: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { password, confirmPassword } = req.body;
    const matchedPassword = confirmPassword.match(password);

    if (!matchedPassword) {
      return res.status(400).json({
        message: "Password does not match."
      })
    }
    const saltPassword = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, saltPassword)
    await Admin.update({ password: hassPassword }, { where: { id: userId } });
    return res.status(200).json({
      message: "Password changed successfully!"
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};


export const allAdminHotels: RequestHandler = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const adminDetails = await Admin.findByPk(adminId, {
      include: [Hotel]
    });
    if (!adminDetails) {
      return res.status(404).json({
        mesage: `Manager with this id: ${adminId} not found!`
      })
    } else {
      return res.status(200).json({
        data: adminDetails
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};
