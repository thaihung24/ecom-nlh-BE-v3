const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const commentControllers = require('../controllers/commentControllers')

router.route('/').post(verifyToken, commentControllers.addComment)
router
  .route('/:id')
  .put(verifyToken, commentControllers.updateComment)
  .delete(verifyToken, commentControllers.deleteComment)

module.exports = router
