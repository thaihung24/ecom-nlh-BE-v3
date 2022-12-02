const catchAsyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')
const Order = require('../models/order/orderModal')
const Item = require('../models/cart/Item')
const Product = require('../models/product/productModel')
const Voucher = require('../models/voucher/voucher')
class orderControllers {
    addOrderItems = catchAsyncHandler(async(req, res, next) => {
            const {
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                voucher,
            } = req.body
            const items = await Item.find({
                user: req.user._id
            })

            if (items && items.length === 0) {
                return next(new ErrorResponse(` no Order item `))
            } else {
                const orderItems = []
                items.map((item) => {
                    orderItems.push(item.item)
                })
                let order = new Order({
                    orderItems,
                    user: req.user._id,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice,
                })
                if (voucher) {

                    const findVoucher = await Voucher.findById(voucher)

                    if (findVoucher) {
                        findVoucher.limit -= 1
                        await findVoucher.save()
                        order.voucher = voucher
                    } else {
                        return next(new ErrorResponse('Voucher not found', 400))
                    }
                }

                const createdOrder = await order.save()
                if (createdOrder) {
                    order.orderItems.map(async(item) => {
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
                    await Item.deleteMany({
                        user: req.user._id
                    })
                    res.status(201).json({
                        success: true,
                        order: createdOrder,
                        message: "Order success"
                    })
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


    //@desc UPDATE order tp paid
    //@route GET/api/orders/:id/pay
    //@access Private
    updateOrderToPaid = catchAsyncHandler(async(req, res) => {
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
    getMyOrders = catchAsyncHandler(async(req, res) => {
            const orders = await Order.find({
                user: req.user._id
            })
            res.json(orders)
        })
        //@desc Get order by ID
        //@route GET/api/orders/:id
        //@access Private

    getOrderById = catchAsyncHandler(async(req, res) => {
            const order = await Order.findById(req.params.id).populate(
                'user',
                'name email'
            )
            if (!order) return next(new ErrorResponse('Order not found', 404))
            res.status(200).json({
                success: true,
                message: 'Get order by ID',
                order,
            })
        })
        //@desc Get order by ID
        //@route GET/api/orders/:id
        //@access Private

    updateOrderById = catchAsyncHandler(async(req, res, next) => {
            const {
                shippingAddress,
                voucher
            } = req.body
            const order = await Order.findById(req.params.id).populate(
                'user',
            )
            if (!order) return next(new ErrorResponse('Order not found', 404))
            order.shippingAddress = shippingAddress
            if (voucher) {
                const findVoucher = await Voucher.findById(voucher)
                if (findVoucher) {
                    findVoucher.limit -= 1
                    await findVoucher.save({
                        validateBeforeSave: false,
                    })
                    order.voucher = voucher
                } else {
                    return next(new ErrorResponse('Voucher Invalid', 400))
                }
            }
            await order.save({
                validateBeforeSave: false
            })
            res.status(200).json({
                success: true,
                message: 'Update order successfully',
                order,
            })
        })
        //@desc GET logged in user orders
        //@route GET/api/orders/
        //@access Private Admin
    getAllOrders = catchAsyncHandler(async(req, res) => {
            const orders = await Order.find({})
            res.json(orders)
        })
        //@desc PUT order by ID
        //@route PUT/api/orders/confirm/:id
        //@access Private Admin
    confirmOrder = catchAsyncHandler(async(req, res, next) => {
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
    updateStatusOrder = catchAsyncHandler(async(req, res, next) => {
            const order = await Order.findOne({
                _id: req.params.id,
                "isConfirm": {
                    $ne: true
                }
            })
            console.log(order)
            if (!order) return next(new ErrorResponse("Valid order not found", 404))
            order.status = req.body.status

            const updateOrder = await order.save({
                validateBeforeSave: false,
            })
            res.status(200).json({
                success: true,
                order: updateOrder,
                message: 'Update order successfully',
            })
        })
        //@desc GET top  user order
        //@route GET / api/users/TopOrder
        //@access Private
    getTopUserOrder = catchAsyncHandler(async(req, res) => {
        const topOrder = await Order.aggregate([{
                $group: {
                    _id: {
                        user: '$user'
                    },
                    count: {
                        $sum: 1
                    }
                }
            }, ])
            .sort({
                count: -1
            })
            .limit(5)

        res.json(topOrder)
    })
}

module.exports = new orderControllers()