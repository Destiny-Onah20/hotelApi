import express from "express";
import adminRoute from "./routers/admin.route";
import userRoute from "./routers/user.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use("/api/v1", adminRoute)
app.use("/api/v1", userRoute)


export default app;