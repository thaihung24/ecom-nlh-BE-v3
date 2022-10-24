const express = require('express')
const router = express.Router()
const userCOntrollers = require('../controllers/userController')
const { protect, admin } = require('../middleware/authMiddleware.js')
//@desc Fetch single products
//@route GET /api/products/:id
//@access Public]]
router
  .route('/')
  .post(userCOntrollers.registerUser)
  .get(protect, admin, userCOntrollers.getUsers)
router.post('/login', userCOntrollers.authUser)
router
  .route('/profile')
  .get(protect, userCOntrollers.getUserProfile)
  .put(protect, userCOntrollers.updateUserProfile)

module.exports = router
