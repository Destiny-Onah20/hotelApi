import logger from "./utils/logger";
import app from "./app";
import sequelize from "./config/config";
import dotenv from "dotenv";
import { schedular } from "./controllers/booking.controller";
dotenv.config();
const port = process.env.PORT;


sequelize.authenticate().then(() => {
  logger.info("Database connected.");
  schedular.start();
}).then(() => {
  app.listen(port, () => {
    logger.info(`Listening to port: ${port}`);
  })
}).catch((error) => {
  logger.error(error.message)
});

process.on('SIGINT', async () => {
  await schedular.stop();
  await sequelize.close();
  logger.info('Server closed');
  process.exit(0);
});



