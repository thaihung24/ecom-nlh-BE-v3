const catchAsyncHandler = require('../middleware/async')
const ErrorResponse = require("../utils/ErrorResponse")
const Item = require("../models/cart/Item")

exports.updateCart = catchAsyncHandler(async(req, res, next) => {
    // VALIDATION
    const {
        productId,
        quantity
    } = req.body

    // ADD TO CART
    // Logic handler
    let updateItem = await Item.findOne({
        user: req.user._id,
        item: productId,
    })
    if (updateItem) {
        const updatedQuantity = updateItem.quantity + quantity > 0 ? updateItem.quantity + quantity : 1
        updateItem.quantity = updatedQuantity
        await updateItem.save({
            validateBeforeSave: false,
        })
    } else {
        await Item.create({
            user: req.user._id,
            quantity: quantity > 0 ? quantity : 1,
            item: productId,
        })
    }
    // Get
    const newCart = await Item.find({
            user: req.user._id,
        })
        // response
    res.json({
        success: true,
        cart: newCart,
        message: 'Cart Added successfully'
    })

})


exports.getCart = catchAsyncHandler(async(req, res, next) => {
    const cart = await Item.find({
        user: req.user._id
    })

    if (!cart) return next(new ErrorResponse("Cart not found", 404))

    res.json({
        success: true,
        cart: cart,
        message: 'Cart get'
    })
})

exports.deleteCart = catchAsyncHandler(async(req, res, next) => {
    const {
        productId
    } = req.params

    const deleted = await Item.findOneAndDelete({
        user: req.user._id,
        item: productId,
    })

    res.json({
        success: true,
        item: deleted,
        message: 'Item deleted successfully'
    })

})