"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const sequelize_1 = require("sequelize");
const admin_model_1 = __importDefault(require("./admin.model"));
class Hotel extends sequelize_1.Model {
    static associate(models) {
        Hotel.belongsTo(models.Admin, { as: "admin", foreignKey: "adminId" });
    }
}
;
Hotel.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    hotelName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    website: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
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
    imageId: {
        type: sequelize_1.DataTypes.STRING,
    },
    adminId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "admins",
            key: "id"
        }
    },
    totalRooms: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: config_1.default,
    tableName: "hotels"
});
Hotel.belongsTo(admin_model_1.default, { foreignKey: "adminId" });
admin_model_1.default.hasMany(Hotel, { foreignKey: "adminId" });
// Hotel.sync({ alter: true }).then(() => {
//   logger.info("Table created.")
// }).catch((err) => {
//   logger.error(err.message)
// });
exports.default = Hotel;
