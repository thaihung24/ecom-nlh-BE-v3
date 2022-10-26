const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth")
const authController = require("../controllers/authController");
const {
    getUserInfo
} = require("../controllers/userController")
    // getInfo (Haven't done)
router.route("/me").get(verifyToken, getUserInfo)
    //[POST] /api/auth/login
router.route("/login").post(authController.login);

//[POST] /api/auth/login
router.route("/register").post(authController.register);

//[POST] /api/auth/verify-email/:token
router.route("/verify-email/:token").post(authController.verifyEmail);


module.exports = router