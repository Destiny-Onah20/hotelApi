import express from "express";
import passport from "passport";
import adminRoute from "./routers/admin.route";
import { facebookSignUp } from "./controllers/users.controller";
import userRoute from "./routers/user.route";
import expressSession from "express-session";

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({
  extended: true
}));
app.use(expressSession({
  secret: "ijfb3bfhir",
  resave: false,
  saveUninitialized: false
}));
passport.serializeUser((user, callback) => {
  callback(null, user)
});



app.use("/api/v1", adminRoute)
app.use("/api/v1", userRoute)


export default app;