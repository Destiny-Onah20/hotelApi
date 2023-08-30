"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const dotenv_1 = __importDefault(require("dotenv"));
const booking_controller_1 = require("./controllers/booking.controller");
dotenv_1.default.config();
const port = process.env.PORT;
config_1.default.authenticate().then(() => {
    logger_1.default.info("Database connected.");
    booking_controller_1.schedular.start();
}).then(() => {
    app_1.default.listen(port, () => {
        logger_1.default.info(`Listening to port: ${port}`);
    });
}).catch((error) => {
    logger_1.default.error(error.message);
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield booking_controller_1.schedular.stop();
    yield config_1.default.close();
    logger_1.default.info('Server closed');
    process.exit(0);
}));
const currentDate = new Date().getDate();
console.log(currentDate);
