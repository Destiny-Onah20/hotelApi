import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/config";
import Admin from "./admin.model";
import Hotel from "./hotel.model";
import roomAttributes from "../interfaces/rooms.interface";
import logger from "../utils/logger";
type optionalHotelAttributes = Optional<roomAttributes, "id" | "createdAt" | "updatedAt">
class Room extends Model<roomAttributes, optionalHotelAttributes> implements roomAttributes {
  public id!: number;
  public roomNumber: number;
  public roomDescription: string;
  public price: number;
  public image: string;
  public hotelId: number;
  public adminId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
};


Room.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  roomNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  roomDescription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hotelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "hotels",
      key: "id"
    }
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "rooms"
});

Room.belongsTo(Hotel, { foreignKey: "hotelId" });
Hotel.hasMany(Room, { foreignKey: "hotelId" })

// Room.sync({ force: true }).then(() => {
//   logger.info("Room table created!");
// }).catch((error) => {
//   logger.error(error.mesage);
// });
export default Room;