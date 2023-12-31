import sequelize from "../config/config";
import { Model, Optional, DataTypes } from "sequelize";
import { UserAttribute } from "../interfaces/user.interface";
import logger from "../utils/logger";

type optionalUserAttributes = Optional<UserAttribute, "id" | "createdAt" | "verify" | "updatedAt" | "token" | "cloudId" | "image" | "status">


class User extends Model<UserAttribute, optionalUserAttributes> {
  public id!: number;
  public fullname!: string;
  public email!: string;
  public password!: string;
  public phoneNumber!: string;
  public image!: string;
  public cloudId!: string
  public token!: string;
  public verify!: boolean;
  public status!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
};

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  cloudId: {
    type: DataTypes.STRING,
    allowNull: true
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
  tableName: "user"
});

// User.sync({ force: true }).then(() => {
//   logger.info("Table created successfully.")
// }).catch((error) => {
//   logger.error(error.message)
// });

export default User;




