const express = require('express')
const router = express.Router()
const upload = require('multer')({
  dest: 'uploads',
})

const verifyToken = require('../middleware/auth')
const { protect, admin } = require('../middleware/authMiddleware')
const eventController = require('../controllers/eventControllers')

// @@USER
//[GET,POST] /api/events
router
  .route('/')
  .get(eventController.getListEvent)
  .post(verifyToken, admin, upload.single('image'), eventController.postEvent)
// [PUT,DELETE] /api/events/:id
router
  .route('/:id')
  .put(protect, admin, upload.single('image'), eventController.updateEvent)
  .delete(verifyToken, admin, eventController.deleteEvent)

module.exports = router
