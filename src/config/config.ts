import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialect: "mysql",
  host: "127.0.0.1",
  define: {
    timestamps: true
  }
});

export default sequelize;