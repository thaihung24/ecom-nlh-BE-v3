const express = require('express')
const router = express.Router()
const orderControllers = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware.js')

router.route('/myorders').get(protect, orderControllers.getMyOrders)
router.route('/:id/pay').put(protect, orderControllers.updateOrderToPaid)
router.route('/:id').get(protect, orderControllers.getOrderById)
router.route('/').post(protect, orderControllers.addOrderItems)

module.exports = router
