import sequelize from "../config/config";
import { Model, Optional, DataTypes } from "sequelize";
import Hotel from "./hotel.model";


interface equipmant {
  id: number;
  hotelName: string
}