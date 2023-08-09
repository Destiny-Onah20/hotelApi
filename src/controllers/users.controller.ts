import { RequestHandler } from "express";
import User from "../models/user.admin";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import { Strategy as facebookStrategy } from "passport-facebook";
import passport from "passport";
import Jwt from "jsonwebtoken";
import mailSender from "../middlewares/mailService";
import Booking from "../models/booking.model";
import Room from "../models/rooms.model";
import { Content } from "mailgen";
import generateMail from "../utils/mailGenerator";
import { UploadedFile } from "express-fileupload";
import Cloudinary from "../utils/cloudinary";


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
      phoneNumber: string
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
    const verifyAccountRoute = `https://hotel-youngmentor.vercel.app/#/userverify/747747`;

    const emailContent: Content = {
      body: {
        name: `${userToCreate.fullname}`,
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
      email: userToCreate.email,
      subject: "Kindly verify!",
      message: emailText,
      html: emailBody
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
    const verifyAccountRoute = `https://room-ka5k.onrender.com/#/user-resetpassword/${validEmail.id}`;

    const emailContent: Content = {
      body: {
        signature: "Sincerely",
        name: `${validEmail.fullname}`,
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
};


export const facebookSignUp: RequestHandler = async (req, res) => {
  try {
    passport.use(new facebookStrategy({
      clientID: <string>process.env.FACE_APP_ID,
      clientSecret: <string>process.env.FACE_APP_SEC,
      callbackURL: "http://localhost:2000/auth/facebook/"
    }, async function (accessToken, refreshToken, profile, callback) {
      try {

        let newEmail = await User.findOne({ where: { email: profile.emails?.[0].value } });
        if (newEmail) {
          return res.status(400).json({
            message: "U already have an account!"
          })
        };
        const userPhoneNumber = profile._json?.phone?.number;
        const saltPassword = await bcrypt.genSalt(10);
        const hassPassword = await bcrypt.hash("", saltPassword);
        type UserAttribute = {
          fullname: string,
          password: string,
          email: string,
          phoneNumber: string
        };
        const data: UserAttribute = {
          fullname: profile.displayName,
          email: <string>profile.emails?.[0].value,
          password: hassPassword,
          phoneNumber: userPhoneNumber
        };
        const userToCreate = new User(data);
        const generateToken = Jwt.sign({
          id: userToCreate.id,
          fullname: userToCreate.fullname
        }, <string>process.env.JWT_TOK, {
          expiresIn: "1d"
        });
        userToCreate.token = generateToken;
        newEmail = await userToCreate.save();
        if (profile.emails && profile.emails.length > 0) {
          const verifyAccountRoute = `${req.protocol}://${req.get("host")}/api/v1/verify/${userToCreate.id}`;
          const message = `Hello cheif ${userToCreate.fullname} Kindly use the link to verify your account  ${verifyAccountRoute}`;
          const mailservice = new mailSender();
          mailservice.createConnection();
          mailservice.mail({
            from: process.env.EMAIL,
            email: userToCreate.email,
            subject: "Kindly verify!",
            message,
            html: ""
          });
        }
        return callback(null, newEmail);
      } catch (error: any) {
        return callback(error)
      }
    }));
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
    })
  }
};


export const roomsBookedByUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const allRooms = await Booking.findAll({
      where: { userId },
      include: [Room]
    });
    if (allRooms.length === 0) {
      return res.status(404).json({
        message: `No room booked by this user: ${userId}`
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


export const updateUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fullname, phoneNumber } = req.body
    const theUser = await User.findByPk(userId);
    if (!theUser) {
      return res.status(404).json({
        message: "No user found!"
      })
    };
    const updateUserData = {
      fullname,
      phoneNumber,
    }
    await User.update(updateUserData, { where: { id: userId } });
    return res.status(200).json({
      message: "Updated Successful!",
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
    })
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const theUser = await User.findByPk(userId);
    if (!theUser) {
      return res.status(404).json({
        message: "No manager found!"
      })
    }
    const genToken = Jwt.sign({
      id: theUser.id
    }, " <string>process.env.JWT_TOK", {
      expiresIn: "1d"
    })
    theUser.token = genToken;
    await theUser.save()
    return res.status(200).json({
      message: "Log out success!"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
    })
  }
};


export const updateImage: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const theUser = await User.findByPk(userId);
    if (!theUser) {
      return res.status(404).json({
        message: "No user found!"
      })
    };
    const existingImage = theUser.image;
    const file = req.files?.image as UploadedFile;
    const upload = Array.isArray(file) ? file : [file];
    for (const file of upload) {
      if (req.files && req.files.image) {
        const result = await Cloudinary.uploader.upload(file.tempFilePath);
        if (theUser.cloudId !== null) {
          await Cloudinary.uploader.destroy(theUser.cloudId)
        }
        const updateUserData = {
          image: result.secure_url,
          cloudId: result.public_id
        }
        await User.update(updateUserData, { where: { id: userId } });
        return res.status(200).json({
          message: "Updated Successful!",
        })
      } else {
        const updateData = {
          image: existingImage,
          cloudId: theUser.cloudId
        }
        await User.update(updateData, { where: { id: userId } });
        return res.status(200).json({
          message: "Updated Successful!",
        })
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      status: "Failed"
    })
  }
};

const he = () => {

}