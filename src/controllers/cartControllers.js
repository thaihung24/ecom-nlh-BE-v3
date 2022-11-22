const catchAsyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const Item = require("../models/cart/Item");
const Product = require("../models/product/productModel");

class cartControllers {
    addToCart = catchAsyncHandler(async(req, res, next) => {
        const {
            quantity,
            item
        } = req.body;

        if (quantity > 0) {
            //update if item exits
            const updateItem = await Item.findOne({
                user: req.user._id,
                "item.product": item.product,
                "item.option": item.option,
                "item.color": item.color,
            });
            if (updateItem) {
                updateItem.item.quantity += Number(quantity);
                await updateItem.save();
            } else {
                const product = await Product.findOne({
                    _id: item.product,
                });
                const option = product.productOptions.find(
                    (r) => r._id.toString() === item.option.toString()
                );
                const color = option.colors.find(
                    (r) => r._id.toString() === item.color.toString()
                );
                const cart = new Item({
                    user: req.user.id,
                    item: {
                        price: option.price,
                        image: product.image,
                        name: product.name,
                        info: {
                            optionName: option.productOptionName,
                            colorName: color.color,
                        },
                        product: item.product,
                        option: item.option,
                        color: item.color,
                        quantity: quantity,
                    },
                });
                // const cart = new Item({
                //   user: req.user.id,
                //   quantity: quantity,
                //   item: item,
                // })
                await cart.save();
            }

            //Get
            const Cart = await Item.find({
                user: req.user._id,
            }).select("item");
            res.status(200).json({
                success: true,
                cart: Cart,
            });
        } else {
            return next(new ErrorResponse("More than one", 404));
        }
    });

    updateCart = catchAsyncHandler(async(req, res, next) => {
        // VALIDATION
        const {
            itemId,
            quantity
        } = req.body;
        const cart = await Item.findById(itemId);
        if (cart && cart.user.toString() === req.user._id.toString()) {
            if (quantity > 0) {
                //update if quantity > 0
                cart.item.quantity = quantity;
                await cart.save();
                res.status(200).json({
                    success: true,
                    cart: cart,
                    message: "Update successfully",
                });
            } else if (quantity === 0) {
                //delete if quantity =0
                await cart.delete();
                res.status(200).json({
                    success: true,
                    message: "Delete successfully",
                });
            }
        } else {
            return next(new ErrorResponse("Cart not found", 404));
        }

    });

    getCart = catchAsyncHandler(async(req, res, next) => {
        const cart = await Item.find({
            user: req.user._id,
        });

        if (!cart) return next(new ErrorResponse("Cart not found", 404));

        res.json({
            success: true,
            cart: cart,
            message: "Cart get",
        });
    });

    getCart = catchAsyncHandler(async(req, res, next) => {
        const cart = await Item.find({
            user: req.user._id,
        })

        if (!cart) return next(new ErrorResponse('Cart not found', 404))

        res.json({
            success: true,
            cart: cart,
            message: 'Cart get',
        })
    })

}
module.exports = new cartControllers()