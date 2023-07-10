import { Request, Express } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;
const fileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null, path.resolve(__dirname, "../uploads"))
  },
  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback) => {
    callback(null, file.originalname)
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
  const extentionName: string = path.extname(file.originalname)
  if (extentionName === 'png' || extentionName === 'jpg' || extentionName === 'jpeg') {
    callback(null, true)
  } else {
    callback(null, false)
  }
};

export const multerUpload = multer({
  storage: fileStorage,
  fileFilter: fileFilter
}
).single("imageId");
