import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/config";
import Room from "./rooms.model";
import User from "./user.admin";
import logger from "../utils/logger";
import Admin from "./admin.model";


interface bookingAttributes {
  id: number;
  checkIn: Date;
  checkOut: Date;
  roomId: number;
  message: string;
  adminId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date
};

type optionalBookingAttributes = Optional<bookingAttributes, "id" | "updatedAt" | "createdAt">;

class Booking extends Model<bookingAttributes, optionalBookingAttributes> implements bookingAttributes {
  public id!: number;
  public checkIn!: Date;
  public checkOut!: Date;
  public roomId!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public message!: string;
  public adminId!: number;
  public readonly updatedAt!: Date;
  public static associate(models: any): void {
    Booking.belongsTo(models.Room, { foreignKey: "roomId" })
  }
};

Booking.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "rooms",
      key: "id"
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
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
  tableName: "bookings"
});

Booking.associate({ Room });
Booking.belongsTo(Admin, { foreignKey: "adminId" })

// Booking.sync({ alter: true }).then(() => {
//   logger.info("Booking Table created!")
// }).catch((error) => {
//   logger.error(error.mesage)
// })

export default Booking;