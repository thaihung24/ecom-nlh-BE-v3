const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/auth')
const { admin } = require('../middleware/authMiddleware.js')
const parser = require("../utils/cloudinaryConfig")
    //[PUT] /api/users/profile
    //[GET] /api/users/profile
router
    .route('/profile')
    .get(verifyToken, userController.getUserProfile)
    .put(verifyToken, userController.updateUserProfile)

router.route('/address/:addressID').delete(verifyToken, userController.deleteAddress)

// avatar update
router.route('/avatar').put(verifyToken, parser.single("image"), userController.updateUserAvatar)


//[PUT] /api/users/profile
//[GET] /api/users/profile
router.route('/').get(verifyToken, admin, userController.getUsers)
router
    .route('/:id')
    .delete(verifyToken, admin, userController.deleteUser)
    .get(verifyToken, admin, userController.getUserById)
    .put(verifyToken, admin, userController.updateUser)

module.exports = router