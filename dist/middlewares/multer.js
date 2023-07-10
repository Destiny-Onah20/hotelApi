"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path_1.default.resolve(__dirname, "../uploads"));
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
const fileFilter = (req, file, callback) => {
    const extentionName = path_1.default.extname(file.originalname);
    if (extentionName === 'png' || extentionName === 'jpg' || extentionName === 'jpeg') {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};
exports.multerUpload = (0, multer_1.default)({
    storage: fileStorage,
    fileFilter: fileFilter
}).single("imageId");
