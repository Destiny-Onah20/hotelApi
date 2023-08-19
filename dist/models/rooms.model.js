"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const hotel_model_1 = __importDefault(require("./hotel.model"));
class Room extends sequelize_1.Model {
}
;
Room.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    roomNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    roomDescription: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    cloudId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    hotelname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    booked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    hotelId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "hotels",
            key: "id"
        }
    },
    adminId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    checkIn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    checkOut: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: config_1.default,
    tableName: "rooms"
});
Room.belongsTo(hotel_model_1.default, { foreignKey: "hotelId" });
hotel_model_1.default.hasMany(Room, { foreignKey: "hotelId" });
// Room.sync({ alter: true }).then(() => {
//   logger.info("Room table created!");
// }).catch((error) => {
//   logger.error(error.mesage);
// });
exports.default = Room;
