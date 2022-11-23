const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')
const { admin } = require('../middleware/authMiddleware')
const eventController = require('../controllers/eventControllers')

// @@USER
//[GET,POST] /api/events
router.route('/').get(eventController.getListEvent)

module.exports = router
