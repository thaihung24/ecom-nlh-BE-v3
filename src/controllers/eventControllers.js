const Event = require('../models/event/event')
const Product = require('../models/product/productModel')
const catchAsyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/ErrorResponse')

class eventController {
    // [GET] /api/events
    getListEvent = catchAsyncHandler(async(req, res, next) => {
            const events = await Event.aggregate([{
                $match: {
                    $expr: {
                        $gt: ["$expireIn", Date.now()]
                    },
                }
            }, {
                $sort: {
                    expireIn: 1,
                }
            }])
            res.status(200).json({
                success: true,
                message: "Available events",
                events,
            })
        })
        // [POST] /api/events
    postEvent = catchAsyncHandler(async(req, res, next) => {
            const {
                products,
                name,
                availableDays,
                color,
                award
            } = JSON.parse(req.body.data)
            let days = availableDays * 24 * 60 * 60 * 1000

            const public_id = req.file.filename.split("/")[1]
            const event = await Event.create({
                name,
                user: req.user._id,
                banner: {
                    url: req.file.path,
                    public_id: public_id
                },
                color,
                award,
                products,
                expireIn: Date.now() + days,
            })
            if (!event) return next(new ErrorResponse("Create event failure", 400))
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
                products,
                addAvailableDays,
                color,
                award
            } = JSON.parse(req.body.data)
            const event = await Event.findOne({
                "_id": req.params.id,
                expireIn: {
                    $gt: Date.now()
                },
            })
            const addDays = addAvailableDays * 24 * 60 * 60 * 1000
            if (!event) return next(new ErrorResponse("Event not found or Expired", 404))
            event.banner.url = req.file.path || event.banner.url
            event.products = products || event.products
            event.name = name || event.name
            event.color = color || event.color
            event.award = award || event.award

            event.expireIn += (addDays || 0)
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
        const event = await Event.findOne({
            "_id": req.params.id,
            expireIn: {
                $gt: Date.now()
            },
        })
        if (!event) return next(new ErrorResponse("Event not found or Expired", 404))
        event.expireIn = new Date(Date.now())
        await event.save({
            validateBeforeSave: true,
        })
        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        })
    })
}
module.exports = new eventController()