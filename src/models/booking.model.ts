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
  adminMessage: string;
  adminId: number;
  price: number;
  amountToPay: number;
  adult: number,
  children: number,
  infant: number,
  roomNumber: number,
  night: number,
  userId: number;
  createdAt: Date;
  updatedAt: Date
};

type optionalBookingAttributes = Optional<bookingAttributes, "id" | "updatedAt" | "createdAt" | "adminMessage">;

class Booking extends Model<bookingAttributes, optionalBookingAttributes> implements bookingAttributes {
  public id!: number;
  public checkIn!: Date;
  public checkOut!: Date;
  public roomId!: number;
  public userId!: number;
  public roomNumber: number;
  public readonly createdAt!: Date;
  public night: number;
  public price!: number;
  public adult: number;
  public children: number;
  public infant: number;
  public amountToPay: number;
  public message!: string;
  public adminMessage!: string;
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
  roomNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  night: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  adult: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  children: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  infant: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  amountToPay: {
    type: DataTypes.DOUBLE,
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
  adminMessage: {
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
Room.hasMany(Booking, { foreignKey: "roomId" });

// Booking.sync({ alter: true }).then(() => {
//   logger.info("Booking Table created!")
// }).catch((error) => {
//   logger.error(error.mesage)
// })

export default Booking;