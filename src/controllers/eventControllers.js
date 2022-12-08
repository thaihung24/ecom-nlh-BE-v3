const Event = require('../models/event/event')
const Product = require('../models/product/productModel')
const catchAsyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')

class eventController {
    // [GET] /api/events
    getListEvent = catchAsyncHandler(async(req, res, next) => {
            const product = await Product.aggregate([{
                $group: {
                    _id: {
                        event: '$event'
                    },
                },
            }, ])
            res.json(product)
        })
        // [POST] /api/events
    postEvent = catchAsyncHandler(async(req, res, next) => {
            const {
                banner,
                products
            } = req.body
            const event = await Event.create({
                user: req.user._id,
                urlBanner: banner,
                products,
            })
            if (!event) return next(ErrorResponse("Create event failure", 400))
            res.status(200).json({
                success: true,
                message: "Event created successfully",
                event
            })
        })
        // [PUT] /api/events/:id
    updateEvent = catchAsyncHandler(async(req, res, next) => {
            const {
                banner,
                products
            } = req.body
            const event = await Event.findById(req.query.id)
            if (!event) return next(new ErrorResponse("Event not found", 404))
            event.urlBanner = banner
            event.products = products
            await event.save({
                validateBeforeSave: false
            })
            res.status(200).json({
                success: true,
                message: "Event updated",
                event
            })
        })
        // [DELETE] /api/events/:id
    deleteEvent = catchAsyncHandler(async(req, res, next) => {
        const event = await Event.findByIdAndDelete(req.query.id)
        if (!event) return next(new ErrorResponse("Event not found", 404))
        res.status(200).json({
            success: false,
            message: "Event deleted successfully",
        })
    })
}
module.exports = new eventController()