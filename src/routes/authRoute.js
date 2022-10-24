
const express = require("express");
const route = express.Router();
const verifyToken = require("../middleware/auth")
const authController = require("../controllers/authController");


route.get("/", verifyToken)
    //[POST] /api/auth/login
route.post("/login", authController.login);

//[POST] /api/auth/login
route.post("/register", authController.register);


module.exports = route