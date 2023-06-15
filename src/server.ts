import logger from "./utils/logger";
import app from "./app";
import sequelize from "./config/config";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;


sequelize.authenticate().then(() => {
  logger.info("Database connected.")
}).then(() => {
  app.listen(port, () => {
    logger.info(`Listening to port: ${port}`)
  })
}).catch((error) => {
  logger.error(error.message)
});

logger.info("HELLO MAN");
