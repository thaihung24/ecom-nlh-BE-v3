const express = require('express')
const router = express.Router()
const orderControllers = require('../controllers/orderController')
const { protect, admin } = require('../middleware/authMiddleware')
const CheckoutController = require('../controllers/checkoutControllers')
const verifyToken = require('../middleware/auth')

router
  .route('/topOrders')
  .get(verifyToken, admin, orderControllers.getTopUserOrder)
router.route('/myorders').get(verifyToken, orderControllers.getMyOrders)
router.route('/:id/pay').put(verifyToken, orderControllers.updateOrderToPaid)
router
  .route('/confirm/:id')
  .put(verifyToken, admin, orderControllers.confirmOrder)
router
  .route('/:id')
  .get(verifyToken, orderControllers.getOrderById)
  .put(verifyToken, orderControllers.updateStatusOrder)

router.route('/:id/update').put(verifyToken, orderControllers.updateOrderById)
router.route('/ipn').post(CheckoutController.paymentNotification)
router.route('/momo/query').post(verifyToken, CheckoutController.queryCheckout)
router.route('/momo').post(verifyToken, CheckoutController.createCheckout)

router
  .route('/')
  .post(verifyToken, orderControllers.addOrderItems)
  .get(verifyToken, admin, orderControllers.getAllOrders)

module.exports = router
