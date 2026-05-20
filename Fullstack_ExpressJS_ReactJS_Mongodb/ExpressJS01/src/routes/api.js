const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  handleForgotPassword,
  handleVerifyOtp,
  handleResetPassword,
  handleVerifyRegisterOtp,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

// Public routes (no auth required)
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/forgot-password", handleForgotPassword);
routerAPI.post("/verify-otp", handleVerifyOtp);
routerAPI.post("/reset-password", handleResetPassword);
routerAPI.post("/verify-register-otp", handleVerifyRegisterOtp);

// Protected routes (auth required)
routerAPI.use(auth);
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

module.exports = routerAPI; //export default
