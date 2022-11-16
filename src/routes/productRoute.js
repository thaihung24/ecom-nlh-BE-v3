const express = require('express')
const router = express.Router()
const productController = require('../controllers/ProductController')
const verifyToken = require('../middleware/auth')
const { admin } = require('../middleware/authMiddleware.js')

router.route('/topreviews').get(productController.getTopProducts)
router.route('/category/:slug').get(productController.getProductsByCategory)
router.route('/subcategory/:id').get(productController.getProductsBySubCategory)
router
  .route('/')
  .get(productController.index)
  .post(verifyToken, admin, productController.createProduct)
router
  .route('/:id')
  .get(productController.getProductById)
  .delete(verifyToken, admin, productController.deleteProduct)
  .put(verifyToken, admin, productController.updateProduct)
router
  .route('/:id/reviews')
  .post(verifyToken, productController.createProductReview)

module.exports = router