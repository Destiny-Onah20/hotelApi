import { RequestHandler } from "express";
import Admin from "../models/admin.model";
import User from "../models/user.admin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authID: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const validUser = await Admin.findOne({ where: { id: userId } });
    if (!validUser) {
      return res.status(401).json({
        message: "This id does not exists!"
      })
    }
    const authenticToken = validUser.token;
    await jwt.verify(authenticToken, <string>process.env.JWT_TOK, (error, payload) => {
      if (error) {
        return error.message
      } else {
        req.user = payload;
        next();
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

export const authorizedAdmin: RequestHandler = async (req, res, next) => {
  try {
    authID(req, res, () => {
      if (req.user) {

      }
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
}