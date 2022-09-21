const express = require("express");
const route = express.Router();
const authController = require("../controllers/authController");

//[POST] /api/auth/login
route.post("/login", authController.login);

//[POST] /api/auth/login
route.post("/register", authController.register);


module.exports = route