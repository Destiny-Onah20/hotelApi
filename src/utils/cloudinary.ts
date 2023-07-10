import dotenv from "dotenv"
dotenv.config();
import { v2 as Cloudinary } from 'cloudinary'
import multer = require("multer");

Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SEC
});


export default Cloudinary;