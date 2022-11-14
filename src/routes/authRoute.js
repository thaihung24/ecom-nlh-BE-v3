const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth")
const {
    admin
} = require("../middleware/authMiddleware")
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const passport = require("passport");

// @@USER

// getInfo (Haven't done)
router.route("/me").get(verifyToken, userController.getUserProfile);
//[POST] /api/auth/login
router.route("/login").post(authController.login);

//[POST] /api/auth/login
router.route("/register").post(authController.register);

//[POST] /api/auth/verify-email/:token
router.route("/verify-email/:token").post(authController.verifyEmail);




// @@ADMIN 

//[GET] /api/auth/admin/users
router.route("/admin/users").get(verifyToken, admin, userController.getUsers);

module.exports = router