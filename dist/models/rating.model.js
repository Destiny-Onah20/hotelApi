"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const sequelize_1 = require("sequelize");
const rooms_model_1 = __importDefault(require("./rooms.model"));
const logger_1 = __importDefault(require("../utils/logger"));
;
class Rating extends sequelize_1.Model {
    static associate(models) {
        Rating.belongsTo(models.Room, { foreignKey: "roomId" });
    }
    ;
}
;
logger_1.default;
Rating.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    comment: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    roomId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
}, {
    sequelize: config_1.default,
    tableName: "ratings"
});
Rating.associate({ Room: rooms_model_1.default });
rooms_model_1.default.hasMany(Rating, { foreignKey: "roomId" });
// Rating.sync().then(() => {
//   logger.info("Rating table created successfully!")
// }).catch((error) => {
//   logger.error(error.mesage)
// })
exports.default = Rating;
