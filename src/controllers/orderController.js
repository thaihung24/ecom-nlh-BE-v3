const asyncHandler = require('express-async-handler')
const catchAsyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const Order = require('../models/order/orderModal')
const Item = require('../models/cart/Item')
const Product = require('../models/product/productModel')
const Voucher = require('../models/voucher/voucher')
class orderControllers {
  addOrderItems = asyncHandler(async (req, res, next) => {
    const {
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      voucher,
    } = req.body
    const items = await Item.find({ user: req.user._id })

    if (items && items.length === 0) {
      res.status(400)
      throw new Error(` no Order item `)
      return
    } else {
      const orderItems = []
      items.map((item) => {
        orderItems.push(item.item)
      })
      if (voucher) {
        const findVoucher = await Voucher.findById(voucher)

        if (findVoucher) {
          findVoucher.limit -= 1
          await findVoucher.save()
        } else {
          return next(new ErrorResponse('Voucher not found', 400))
        }
      }
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        voucher,
      })
      const createdOrder = await order.save()
      if (createdOrder) {
        order.orderItems.map(async (item) => {
          const product = await Product.findById(item.product)
          product.productOptions.forEach((Option, index) => {
            if (Option._id.toString() === item.option.toString()) {
              Option.colors.forEach((color, i) => {
                if (color._id.toString() === item.color.toString()) {
                  product.productOptions[index].colors[i].quantity -=
                    item.quantity
                }
              })
            }
          })
          await product.save()
        })
        await Item.deleteMany({ user: req.user._id })
        res.status(201).json(createdOrder)
      } else {
        if (voucher) {
          const findVoucher = await Voucher.findById(voucher)
          await findVoucher.save()
          if (findVoucher) {
            findVoucher.limit += 1
          }
        }
        return next(new ErrorResponse('Add order fail', 400))
      }
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
  //@desc GET logged in user orders
  //@route GET/api/orders/
  //@access Private Admin
  getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
    res.json(orders)
  })
  //@desc PUT order by ID
  //@route PUT/api/orders/confirm/:id
  //@access Private Admin
  confirmOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (order) {
      order.isConfirm = true
      await order.save()
      res.json({
        success: true,
        message: 'Order confirmed successfully',
      })
    } else {
      return next(new ErrorResponse('Confirm failed', 404))
    }
  })

  //@desc Update status
  //@route PUT/api/orders/:id
  //@access Private
  //In body
  /*
  status:{
    statusNow:"cancel",
    description:"Ly do huy"
  }
  */
  //in Body
  updateStatusOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (order && order.isConfirm === false) {
      order.status = req.body.status
      const updateOrder = await order.save()
      if (updateOrder) {
        res.status(200).json({
          success: true,
          order: updateOrder,
          message: 'update order successfully',
        })
      } else {
        return next(new ErrorResponse('update failed', 404))
      }
    } else {
      return next(
        new ErrorResponse(
          'update order not found or order was confirm by admin',
          404
        )
      )
    }
  })
}

module.exports = new orderControllers()
