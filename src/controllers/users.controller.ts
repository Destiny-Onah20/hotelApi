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
        message: "Email already taken!"
      })
    }
    const saltPassword = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, saltPassword);
    type UserAttribute = {
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
      status: "Failed"
    })
  }
};


export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authEmail = await User.findOne({ where: { email: email } });
    if (!authEmail) {
      return res.status(400).json({
        message: "Email or password doesn't match!"
      })
    }
    const authPassword = await bcrypt.compare(password, authEmail.password);
    if (!authPassword) {
      return res.status(400).json({
        message: "Email or password doesn't match!"
      })
    }
    const generateToken = Jwt.sign({
      id: authEmail.id,
      fullname: authEmail.fullname
    }, <string>process.env.JWT_TOK, {
      expiresIn: "1d"
    });
    authEmail.token = generateToken;
    await authEmail.save();
    return res.status(200).json({
      message: "Loggin Success!",
      data: authEmail
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
    })
  }
};

export const verifyUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const authUser = await User.findOne({ where: { id: userId } });
    if (!authUser) {
      return res.status(400).json({
        message: "This user does not exists."
      })
    }
    await User.update({
      verify: true
    }, { where: { id: userId } });
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

export const forgottenPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const validEmail = await User.findOne({ where: { email: email } });
    if (!validEmail) {
      return res.status(400).json({
        message: "Email inputed does not exist!"
      })
    }
    const regexValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const validateEmail = email.match(regexValidation);
    if (!validateEmail) {
      return res.status(400).json({
        message: "Invalid Email format!"
      })
    }
    const changePasswordRoute = `${req.protocol}://${req.get("host")}/api/v1/change/${validEmail.id}`;
    const message = `Hello ${validEmail.fullname} you required for a change of password, 
    here use this link to change your password ${changePasswordRoute}`
    const mailServiceInstance = new mailSender();
    mailServiceInstance.createConnection();
    mailServiceInstance.mail({
      from: process.env.EMAIL,
      email: validEmail.email,
      subject: "Forgotten Password!",
      message
    });
    return res.status(200).json({
      message: "Please check your mail for forgotten password mail!"
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
    })
  }
};

export const changePasswordUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { password, confirmPassword } = req.body;
    const matchedPassword = password.match(confirmPassword);
    if (!matchedPassword) {
      return res.status(400).json({
        message: "Password does not match, please check and confirm!"
      })
    };
    const saltPassword = await bcrypt.genSalt(9);
    const hassPassword = await bcrypt.hash(password, saltPassword);
    await User.update(
      { password: hassPassword },
      {
        where: {
          id: userId
        }
      })
    return res.status(200).json({
      message: "Password changed successful!"
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
    })
  }
}