const express=require("express");
const router =express.Router();
const User =require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport =require("passport");
const {saveRedirectUrl}= require("../middleware.js");
const userController = require("../controllers/user.js");

// SIGNUP PAGE
router.get("/signup", userController.renderSignupForm);
// SIGNUP
router.post("/signup", wrapAsync(userController.signup));

// LOGIN PAGE
router.get("/login", userController.renderLoginForm);

// LOGIN
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userController.login
);

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;