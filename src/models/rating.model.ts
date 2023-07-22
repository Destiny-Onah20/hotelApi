import sequelize from "../config/config";
import { Model, DataTypes, Optional } from "sequelize";
import Room from "./rooms.model";
import logger from "../utils/logger";


interface rating {
  id: number
  rating: number,
  comment: string | null,
  createdAt: Date,
  updatedAt: Date,
  roomId: number,
  userId: number
};

type OptionalRating = Optional<rating, "id" | "updatedAt" | "createdAt">

class Rating extends Model<rating, OptionalRating> implements rating {
  id!: number;
  rating!: number;
  comment!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  roomId: number;
  userId: number;

  public static associate(models: any): void {
    Rating.belongsTo(models.Room, { foreignKey: "roomId" });
  };

};
logger

Rating.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true
  },
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  tableName: "ratings"
});

Rating.associate({ Room });
Room.hasMany(Rating, { foreignKey: "roomId" });

// Rating.sync().then(() => {
//   logger.info("Rating table created successfully!")
// }).catch((error) => {
//   logger.error(error.mesage)
// })

export default Rating;