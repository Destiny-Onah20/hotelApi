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
import { UploadedFile } from "express-fileupload";
import Cloudinary from "../utils/cloudinary";
import { QueryInterface, Sequelize } from "sequelize";
import sequelize from "../config/config";


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
      message: "Admin created successfully."
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
    }
    else {
      const verified = checkAdmin.verify
      if (!verified) {
        return res.status(400).json({
          message: "Please verify your account!"
        })
      }
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
        accessToken: generateToken
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
};


export const logOut: RequestHandler = async (req, res) => {
  try {
    const { adminId } = req.params;
    const theAdmin = await Admin.findByPk(adminId);
    if (!theAdmin) {
      return res.status(404).json({
        message: "No manager found!"
      })
    }
    const genToken = Jwt.sign({
      id: theAdmin.id
    }, " <string>process.env.JWT_TOK", {
      expiresIn: "1d"
    })
    theAdmin.token = genToken;
    await theAdmin.save()
    return res.status(200).json({
      message: "Log out success!"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
}


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
    const verifyAccountRoute = `https://room-ka5k.onrender.com/#/adminresetpassword/${validEmail.id}`;

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
    const adminId = req.params.adminId;
    const { password } = req.body;
    const saltPassword = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, saltPassword)
    await Admin.update({ password: hassPassword }, { where: { id: adminId } });
    return res.status(200).json({
      message: "Password changed successfully!"
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const UpdateAdmin: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.files?.image as UploadedFile[];
    if (!file) {
      throw new Error("No file Uploade")
    }
    const upload = Array.isArray(file) ? file : [file];
    for (const file of upload) {
      const result = await Cloudinary.uploader.upload(file.tempFilePath);

      interface admin {
        name: string;
        image: string;
        cloudId: string
      };

      const updateDAta: admin = {
        name,
        image: result.secure_url,
        cloudId: result.public_id
      };

      const updateTheAdmin = await Admin.update(updateDAta, { where: { id: req.params.adminId } });
      if (!updateTheAdmin) {
        return res.status(400).json({
          messge: "An error occured Updating this admin"
        })
      } else {
        return res.status(400).json({
          messge: "Update successfull!"
        })
      }
    }

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const sendAccessToken: RequestHandler = async (req, res) => {
  try {
    const { adminId } = req.params;
    const theAdmin = await Admin.findByPk(adminId)
    const validEmail = await Admin.findOne({ where: { email: theAdmin?.email } });
    if (!validEmail) {
      return res.status(400).json({
        message: "This email does not exist!"
      })
    };
    const generateToken = (): string => {
      const digits = '0123456789';
      let uniqueNumber = '';

      while (uniqueNumber.length < 4) {
        const randomDigit = digits.charAt(Math.floor(Math.random() * digits.length));

        if (!uniqueNumber.includes(randomDigit)) {
          uniqueNumber += randomDigit;
        }
      }
      return uniqueNumber;
    };
    // console.log(theAdmin);
    const theToken = generateToken();
    const emailContent: Content = {
      body: {
        name: `${validEmail.name}`,
        intro: `Thank you for your email change request, in order to proceed, please copy and paste the PIN number below to complete the email verification.`,
        table: {
          data: [
            {
              key: 'To change your email, please use this code :',
              value: theToken,
            },
          ],
        },
        outro: 'If you did not request for this action, you can ignore this email.',
      },
    };
    const emailBody = generateMail.generate(emailContent);
    const emailText = generateMail.generatePlaintext(emailContent);

    const mailservice = new mailSender();
    mailservice.createConnection();
    mailservice.mail({
      from: process.env.EMAIL,
      email: validEmail.email,
      subject: "Change email request PIN",
      message: emailText,
      html: emailBody
    });
    validEmail.emailPin = theToken;
    await validEmail.save();
    return res.status(200).json({
      message: "Check your email for accessToken!"
    })

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const changeEmailAddress: RequestHandler = async (req, res) => {
  try {

    const { adminId } = req.params;
    const { newEmail, pin } = req.body;
    const theAdmin = await Admin.findByPk(adminId);
    if (!theAdmin) {
      return res.status(404).json({
        message: "No User found"
      })
    };
    const Pin = theAdmin.emailPin
    const validPin = Pin.match(pin);
    if (!validPin) {
      return res.status(400).json({
        message: "Invalid Pin!"
      })
    }
    await Admin.update({ email: newEmail }, { where: { id: adminId } });
    const verifyAccountRoute = `https://hotel-youngmentor.vercel.app/#/alllogin/adminlogin`;

    const emailContent: Content = {
      body: {
        name: `${theAdmin.name}`,
        intro: `You have successfully changed your email address:`,
        action: {
          instructions: 'Continue your great experience with Room.ng , please click the button below:',
          button: {
            color: '#2db9ff',
            text: 'Head to Room',
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
      email: newEmail,
      subject: "Change of Email!",
      message: emailText,
      html: emailBody
    });
    return res.status(200).json({
      message: "Email Updated Success!"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
}

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


export const vacantRoomByAdmin: RequestHandler = async (req, res) => {
  try {
    const { adminId } = req.params;
    const vacantRoom = await Room.findAll({
      where: {
        adminId,
        booked: false
      }
    });
    if (!vacantRoom) {
      return res.status(404).json({
        message: 'No room Found!'
      })
    }
    return res.status(200).json({
      message: `All Vacant rooms Registered by ${adminId}: ${vacantRoom.length} `,
      data: vacantRoom
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const deleteAdmin: RequestHandler = async (req, res) => {
  try {
    const adminIdsToDelete = [1, 2, 3, 4, 5, 30, 33, 40]; // Replace with the actual admin IDs
    const defaultAdminId = 999;

    for (const adminId of adminIdsToDelete) {
      await Hotel.update({ adminId: defaultAdminId }, { where: { adminId } });
    }
    const deleteAllAdmin = await Admin.destroy({ where: { id: adminIdsToDelete } });
    if (deleteAllAdmin) {
      return res.status(200).json({
        message: "success!"
      });
    } else {
      return res.status(400).jsonp({
        message: "Something went wrong"
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};


export const getAllAdmin: RequestHandler = async (req, res) => {
  try {
    const { accessToken } = req.params;
    const theAdmin = await Admin.findOne({
      where: { token: accessToken },
      include: [Hotel]
    });
    if (!theAdmin) {
      return res.status(401).json({
        message: "This user does not exists!"
      })
    }
    const authenticToken = theAdmin.token;
    Jwt.verify(authenticToken, <string>process.env.JWT_TOK, (error) => {
      if (error) {
        return res.status(400).json({
          message: "please log in!"
        })
      }
    })
    return res.status(200).json({
      message: 'THe users data',
      data: theAdmin
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};