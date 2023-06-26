import express from "express";
import passport from "passport";
import adminRoute from "./routers/admin.route";
import userRoute from "./routers/user.route";

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({
  extended: true
}));

passport.serializeUser((user, callback) => {
  callback(null, user)
});
passport.deserializeUser((user, callback) => {
  callback(null)
})
app.use("/api/v1", adminRoute)
app.use("/api/v1", userRoute)


export default app;