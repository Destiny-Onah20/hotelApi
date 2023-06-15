import sequelize from "../config/config";
import { DataTypes, Model, Optional } from "sequelize";
import { AdminAttribute } from "../interfaces/admin.interface";
import logger from "../utils/logger";
import User from "./user.admin"

type optionalAttributes = Optional<AdminAttribute, "id" | "createdAt" | "updatedAt" | "isAdmin" | "token" | "verify">

class Admin extends Model<AdminAttribute, optionalAttributes> {
  public id!: number;
  public hotelName!: string;
  public password!: string;
  public isAdmin!: boolean;
  public email!: string;
  public verify!: boolean;
  public token!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

};


Admin.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  hotelName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
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
  tableName: "admin"
});

// Admin.sync({ force: true }).then(() => {
//   logger.info("Table created successfully.")
// }).catch((error) => {
//   logger.error(error.message)
// });

export default Admin;