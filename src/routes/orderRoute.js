const express = require('express')
const router = express.Router()
const orderControllers = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware.js')
const verifyToken = require('../middleware/auth')

router.route('/myorders').get(verifyToken, orderControllers.getMyOrders)
router.route('/:id/pay').put(verifyToken, orderControllers.updateOrderToPaid)
router.route('/:id').get(verifyToken, orderControllers.getOrderById)
router.route('/').post(verifyToken, orderControllers.addOrderItems)

module.exports = router
