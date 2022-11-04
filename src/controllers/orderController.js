const asyncHandler = require('express-async-handler')
const catchAsyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const Order = require('../models/order/orderModal')
class orderControllers {
  addOrderItems = asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body

    if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error(` no Order item `)
      return
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
      const createdOrder = await order.save()
      order.orderItems.forEach(async (item) => {
        const product = await Product.findById(item.product)
        product.productOptions.forEach((Option, index) => {
          Option.colors.forEach((color, i) => {
            if (color.color.toString() === item.color) {
              product.productOptions[index].colors[i].quantity -= item.qty
            }
          })
        })
        await product.save()
      })
      res.status(201).json(createdOrder)
    }
  })
  //@desc Get order by ID
  //@route GET/api/orders/:id
  //@access Private

  getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    )
    if (order) {
      res.json(order)
    } else {
      res.status(404)
    }
  })

  //@desc UPDATE order tp paid
  //@route GET/api/orders/:id/pay
  //@access Private
  updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      }
      const updateOrder = await order.save()
      res.json(updateOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  })
  //@desc GET logged in user orders
  //@route GET/api/orders/myorders
  //@access Private
  getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
  })
}

module.exports = new orderControllers()
