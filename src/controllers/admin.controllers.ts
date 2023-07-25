import { RequestHandler } from "express";
import Admin from "../models/admin.model";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import mailSender from "../middlewares/mailService";
import Hotel from "../models/hotel.model";
import Room from "../models/rooms.model";
import Booking from "../models/booking.model"; import { Content } from "mailgen";
import generateMail from "../utils/mailGenerator";
"#2db9ff"


export const registerAdmin: RequestHandler = async (req, res): Promise<object> => {
  try {
    const { name, password, email } = req.body;
    const checkAdmin = await Admin.findOne({ where: { email: email } });
    if (checkAdmin) {
      return res.status(400).json({
        message: "Email already taken."
      })
    }
    const saltPassword = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, saltPassword);
    type AdminAttribute = {
      name: string,
      password: string,
      email: string
    }
    const data: AdminAttribute = {
      name: name.toUpperCase(),
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

    const verifyAccountRoute = `https://hotel-youngmentor.vercel.app/#/adminverify/747747`;

    const emailContent: Content = {
      body: {
        name: `${creatingData.name}`,
        intro: `Welcome to our site! Please verify your account by clicking the button below:`,
        action: {
          instructions: 'To verify your account, please click the button below:',
          button: {
            color: '#2db9ff',
            text: 'Verify Account',
            link: verifyAccountRoute,
          },
        },
        outro: 'If you did not sign up for our site, you can ignore this email.',
      },
    };
    const emailBody = generateMail.generate(emailContent);
    const emailText = generateMail.generatePlaintext(emailContent);

    const mailservice = new mailSender();
    mailservice.createConnection();
    mailservice.mail({
      from: process.env.EMAIL,
      email: creatingData.email,
      subject: "Kindly verify!",
      message: emailText,
      html: emailBody
    });
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

export const verifyAdmin: RequestHandler = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const authAdmin = await Admin.findOne({ where: { id: adminId } });
    if (!authAdmin) {
      return res.status(400).json({
        message: "This Admin does not exists."
      })
    }
    await Admin.update({
      verify: true
    }, { where: { id: adminId } });
    return res.status(200).json({
      message: "Account verified"
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
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
    const verifyAccountRoute = `https://hotel-youngmentor.vercel.app/#/userverify/747747`;

    const emailContent: Content = {
      body: {
        name: `${validEmail.name}`,
        intro: `You have requested to reset your password. Please click the button below to proceed:`,
        action: {
          instructions: 'To reset your password, please click the button below:',
          button: {
            color: '#2db9ff',
            text: 'Reset Password',
            link: verifyAccountRoute,
          },

        },
        outro: 'If you did not sign up for our site, you can ignore this email.',
      },
    };
    const emailBody = generateMail.generate(emailContent);
    const emailText = generateMail.generatePlaintext(emailContent);

    const mailservice = new mailSender();
    mailservice.createConnection();
    mailservice.mail({
      from: process.env.EMAIL,
      email: validEmail.email,
      subject: "Reset Password!",
      message: emailText,
      html: emailBody
    });
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


export const getAllRoomsByAdmin: RequestHandler = async (req, res) => {
  try {
    const { adminId } = req.params;
    const theAdminRoom = await Room.findAll({
      where: {
        adminId
      }
    });
    if (!theAdminRoom) {
      return res.status(404).json({
        message: 'No room Found!'
      })
    }
    return res.status(200).json({
      message: `All rooms Registered by ${adminId} ${theAdminRoom.length} `,
      data: theAdminRoom
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const allAdminRoomsBooked: RequestHandler = async (req, res) => {
  try {
    const { adminId } = req.params;
    const allRooms = await Booking.findAll({
      where: { adminId },
      include: [Room]
    });
    if (allRooms.length === 0) {
      return res.status(404).json({
        message: `No room booked by this user: ${adminId}`
      })
    } else {
      return res.status(200).json({
        message: `all the rooms booked ${allRooms.length}`,
        data: allRooms
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
    })
  }
};