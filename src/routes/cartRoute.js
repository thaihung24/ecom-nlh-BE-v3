const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const { admin } = require('../middleware/authMiddleware')
const cartControllers = require('../controllers/cartControllers')

// @@USER
//[GET,POST] /api/auth/cart
router
    .route('/')
    .get(verifyToken, cartControllers.getCart)
    .put(verifyToken, cartControllers.updateCart)
    .post(verifyToken, cartControllers.addToCart)
    // @@ADMIN
    //[GET] /api/auth/admin/users
router.route('/admin').get((req, res) => {
    res.json({
        message: 'cart route',
    })
})

module.exports = router