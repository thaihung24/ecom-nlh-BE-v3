<<<<<<< HEAD
const ErrorResponse = require("../utils/ErrorResponse")
const catchAsyncHandler = require("../middleware/async")


exports.getUserInfo = catchAsyncHandler(async(req, res, next) => {

    res.json({
        success: true,
        data: [],
        message: "Get user info"
    })

})
=======
const User = require('../models/user/User')
const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')
class userControllers {
  authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    console.log(user)
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('invalid email or password')
    }
    // res.send({ email, password })
  })
  //@desc Register a new user
  //@route POST / api/users
  //@access Public
  registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }
    const user = await User.create({
      name,
      email,
      password,
    })
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error(`invalid  user data`)
    }
  })
  //@desc GET user profile
  //@route POST / api/users/profile
  //@access Private
  getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('User not found')
    }
  })
  //@desc UPDATE user profile
  //@route PUT / api/users/profile
  //@access Private
  updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = req.body.password
      }
      const updateUser = await user.save()
      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('User not found')
    }
  })

  //@desc GET all user profile
  //@route GET / api/users
  //@access Private
  getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
  })
}

module.exports = new userControllers()
>>>>>>> 3b69f77636442bed27570a24333deb51d023d8b6
