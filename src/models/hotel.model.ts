import sequelize from "../config/config";
import { Model, Optional, DataTypes } from "sequelize";
import { hotelAttributes } from "../interfaces/hotel.interface";

type hotelOption = Optional<hotelAttributes, "id">

class Hotel extends Model<hotelAttributes, hotelOption> {
  public id!: string;
  public hotelName!: string;
  public address!: string;
  public taken!: boolean;
  public description!: string;
  public website!: string;
  public email!: string;
  public city!: string;
  public state!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date

}