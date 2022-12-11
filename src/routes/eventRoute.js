const express = require('express')
const router = express.Router()
const {
    eventParser
} = require("../utils/cloudinaryConfig")
const verifyToken = require('../middleware/auth')
const {
    admin
} = require('../middleware/authMiddleware')
const eventController = require('../controllers/eventControllers')

// @@USER
//[GET,POST] /api/events
router.route('/').get(eventController.getListEvent).post(verifyToken, admin, eventParser.single("image"), eventController.postEvent)
    // [PUT,DELETE] /api/events/:id
router.route('/:id').put(verifyToken, admin, eventParser.single("image"), eventController.updateEvent).delete(verifyToken, admin, eventController.deleteEvent)

module.exports = router