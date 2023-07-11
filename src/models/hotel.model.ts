import sequelize from "../config/config";
import { Model, Optional, DataTypes, BelongsToGetAssociationMixin } from "sequelize";
import { hotelAttributes } from "../interfaces/hotel.interface";
import Admin from "./admin.model";
import logger from "../utils/logger";

type HotelCreationAttributes = Optional<hotelAttributes, "id" | "updatedAt" | "createdAt">

class Hotel extends Model<hotelAttributes, HotelCreationAttributes> implements hotelAttributes {
  public id!: number;
  public hotelName!: string;
  public address!: string;
  public taken!: boolean;
  public description!: string;
  public website!: string;
  public email!: string;
  public city!: string;
  public state!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public adminId!: number;
  public imageId!: string;
  public totalRooms!: number;
  public getAdmin!: BelongsToGetAssociationMixin<Admin>;
  public static associate(models: any): void {
    Hotel.belongsTo(models.Admin, { as: "admin", foreignKey: "adminId" })
  }

};

Hotel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  hotelName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
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
  },
  imageId: {
    type: DataTypes.STRING,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "admins",
      key: "id"
    }
  },
  totalRooms: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "hotels"
});

Hotel.belongsTo(Admin, { foreignKey: "adminId" });
Admin.hasMany(Hotel, { foreignKey: "adminId" })
// Hotel.sync({ alter: true }).then(() => {
//   logger.info("Table created.")
// }).catch((err) => {
//   logger.error(err.message)
// });



export default Hotel;