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
                products,
                name
            } = JSON.parse(req.body.data)
            const public_id = req.file.filename.split("/")[1]
            const event = await Event.create({
                name,
                user: req.user._id,
                banner: {
                    url: req.file.path,
                    public_id: public_id
                },
                products,
            })
            if (!event) return next(new ErrorResponse("Create event failure", 400))
            console.log(event)
            res.status(200).json({
                success: true,
                message: "Event created successfully",
                event
            })
        })
        // [PUT] /api/events/:id
    updateEvent = catchAsyncHandler(async(req, res, next) => {
            const {
                name,
                products
            } = JSON.parse(req.body.data)
            const event = await Event.findById(req.params.id)
            if (!event) return next(new ErrorResponse("Event not found", 404))
            event.banner.url = req.file.path || event.banner.url
            event.products = products || event.products
            event.name = name || event.name
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
        const event = await Event.findByIdAndDelete(req.params.id)
        if (!event) return next(new ErrorResponse("Event not found", 404))
        res.status(200).json({
            success: false,
            message: "Event deleted successfully",
        })
    })
}
module.exports = new eventController()