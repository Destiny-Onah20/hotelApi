import { Sequelize, Options } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MYSQL_URL);

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

// database.ts


// const sequelize = new Sequelize(process.env.DATABASE_URL!);





export default sequelize;