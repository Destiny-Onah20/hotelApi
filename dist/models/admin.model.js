"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../utils/logger"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
class Admin extends sequelize_1.Model {
    static associate(models) {
        Admin.hasMany(models.Hotel, { foreignKey: "adminId", as: "hotels" });
    }
}
;
Admin.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    hotelName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    verify: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
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
    tableName: "admins"
});
Admin.hasMany(hotel_model_1.default, { foreignKey: "adminId", as: "hotels" });
Admin.sync({ force: true }).then(() => {
    logger_1.default.info("Table created successfully.");
}).catch((error) => {
    logger_1.default.error(error.message);
});
exports.default = Admin;
