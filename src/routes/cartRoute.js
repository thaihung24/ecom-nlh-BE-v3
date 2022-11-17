const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth")
const {
    admin
} = require("../middleware/authMiddleware")

const {
    updateCart,
    getCart,
    deleteCart
} = require('../controllers/cartController')


// @@USER
//[GET,POST] /api/auth/cart
router.route("/").get(verifyToken, getCart).post(verifyToken, updateCart);

//[DELETE] /api/auth/cart/:productId
router.route("/:productId").delete(verifyToken, deleteCart)



// @@ADMIN 
//[GET] /api/auth/admin/users
router.route("/admin").get((req, res) => {
    res.json({
        message: "cart route",
    })
});

module.exports = router