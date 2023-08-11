import sequelize from "../config/config";
import { DataTypes, Model, Optional } from "sequelize";
import { AdminAttribute } from "../interfaces/admin.interface";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";
import User from "./user.admin"
import Hotel from "./hotel.model";

type optionalAttributes = Optional<AdminAttribute, "id" | "createdAt" | "updatedAt" | "isAdmin" | "token" | "verify" | "image" | "cloudId" | "emailPin">

class Admin extends Model<AdminAttribute, optionalAttributes> implements AdminAttribute {
  public id!: Buffer;
  public name!: string;
  public password!: string;
  public isAdmin!: boolean;
  public email!: string;
  public verify!: boolean;
  public image!: string;
  public emailPin: string;
  public cloudId!: string;
  public token!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any): void {
    Admin.hasMany(models.Hotel, { foreignKey: "adminId", as: "hotels" });
  }
};


Admin.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    validate: { isUUID: 4 },
    get() {
      return Buffer.from(this.getDataValue('id'));
    },
    set(value: string | Buffer) {
      this.setDataValue('id', Buffer.from(value));
    },
  },
  name: {
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
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emailPin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cloudId: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: "admins"
});


// Admin.sync({ alter: true }).then(() => {
//   logger.info("Table created successfully.")
// }).catch((error) => {
//   logger.error(error.message)
// });

export default Admin;