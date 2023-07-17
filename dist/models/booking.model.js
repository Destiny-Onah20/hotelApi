"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const rooms_model_1 = __importDefault(require("./rooms.model"));
;
class Booking extends sequelize_1.Model {
    static associate(models) {
        Booking.belongsTo(models.Room, { foreignKey: "roomId" });
    }
}
;
Booking.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    checkIn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    checkOut: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    roomId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "rooms",
            key: "id"
        }
    },
    userId: {
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
    }
}, {
    sequelize: config_1.default,
    tableName: "bookings"
});
Booking.associate({ Room: rooms_model_1.default });
rooms_model_1.default.hasMany(Booking, { foreignKey: "roomId" });
// Booking.sync().then(() => {
//   logger.info("Booking Table created!")
// }).catch((error) => {
//   logger.error(error.mesage)
// })
exports.default = Booking;
