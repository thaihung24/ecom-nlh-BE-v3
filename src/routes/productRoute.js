const express = require('express')
const router = express.Router()
const productController = require('../controllers/ProductController')
const verifyToken = require('../middleware/auth')
const {
    admin
} = require('../middleware/authMiddleware.js')


router
    .route('/:id')
    .get(productController.getProductById)
    .delete(verifyToken, admin, productController.deleteProduct)
    .put(verifyToken, admin, productController.updateProduct)
router
    .route('*')
    .get(productController.index)
    .post(verifyToken, admin, productController.createProduct)
module.exports = router