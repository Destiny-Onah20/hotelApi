import { Sequelize, Options } from "sequelize";
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize(process.env.MYSQL_URL!, {
  database: process.env.MYSQLDATABASE,
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  dialect: "mysql",
  port: <any>process.env.MYSQLPORT,
  host: process.env.MYSQLHOST,
  define: {
    timestamps: true
  },
});








export default sequelize;