const {
    Router
} = require("express");
const express = require("express");
const route = express.Router();
const verifyToken = require("../middleware/auth")
const authController = require("../controllers/authController");
const {
    getUserInfo
} = require("../controllers/userController")
    // getInfo (Haven't done)
route.route("/me").get(verifyToken, getUserInfo)
    //[POST] /api/auth/login
route.post("/login", authController.login);

//[POST] /api/auth/login
route.post("/register", authController.register);


module.exports = route