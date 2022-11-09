const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const commentControllers = require('../controllers/commentControllers')

router
  .route('/:id/reply')
  .post(verifyToken, commentControllers.addReplyComment)
  .put(verifyToken, commentControllers.updateReplyComment)
router
  .route('/:id')
  .put(verifyToken, commentControllers.updateComment)
  .delete(verifyToken, commentControllers.deleteComment)
router.route('/').post(verifyToken, commentControllers.addComment)

module.exports = router
