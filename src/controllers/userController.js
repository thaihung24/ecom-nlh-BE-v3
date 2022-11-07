const ErrorResponse = require("../utils/ErrorResponse")
const User = require('../models/user/User')
const catchAsyncHandler = require('../middleware/async')
const generateToken = require('../utils/generateToken')
class userControllers {
    //@desc GET user profile
    //@route POST / api/users/profile
    //@access Private
    getUserProfile = catchAsyncHandler(async(req, res) => {

            const user = await User.findById(req.user.id)
            if (!user) {
                return next(new ErrorResponse('User not found', 404))

            }
            res.status(200).json({
                success: true,
                user,
                message: "User Info",
            })
        })
        //@desc UPDATE user profile
        //@route PUT / api/users/profile
        //@access Private
    updateUserProfile = catchAsyncHandler(async(req, res) => {
        const user = await User.findById(req.user._id)
        if (!user) {
            return next(new ErrorResponse('User not found', 401))
        }
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
        const updateUser = await user.save()
        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        })
    })

    //@desc GET all user profile
    //@route GET / api/users
    //@access Private
    getUsers = catchAsyncHandler(async(req, res) => {
        const users = await User.find({})
        res.json({
            success: true,
            users
        })
    })
}

module.exports = new userControllers()