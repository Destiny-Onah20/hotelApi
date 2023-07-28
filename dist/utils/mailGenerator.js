"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailgen_1 = __importDefault(require("mailgen"));
"₦";
const generateMail = new mailgen_1.default({
    theme: "default",
    product: {
        name: `ROOM`,
        link: "https://hotel-youngmentor.vercel.app/",
        logo: "https://hotel-youngmentor.vercel.app/assets/RoomLogo-removebg-preview-d6bc1e68.png"
    }
});
exports.default = generateMail;
