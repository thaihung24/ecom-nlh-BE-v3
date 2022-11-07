<<<<<<< HEAD
const User = require("../models/user/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
class userControllers {
  authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("invalid email or password");
    }
    // res.send({ email, password })
  });
  //@desc Register a new user
  //@route POST / api/users
  //@access Public
  registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error(`invalid  user data`);
    }
  });
  //@desc GET user profile
  //@route POST / api/users/profile
  //@access Private
  getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("User not found");
    }
  });
  //@desc UPDATE user profile
  //@route PUT / api/users/profile
  //@access Private
  updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updateUser = await user.save();
=======
const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../models/user/User')
const catchAsyncHandler = require('../middleware/async')
const generateToken = require('../utils/generateToken')
class userControllers {
  //@desc GET user profile
  //@route POST / api/users/profile
  //@access Private
  getUserProfile = catchAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if (!user) {
      return next(new ErrorResponse('User not found', 404))
    }
    res.status(200).json({
      success: true,
      user,
      message: 'User Info',
    })
  })
  //@desc UPDATE user profile
  //@route PUT / api/users/profile
  //@access Private
  updateUserProfile = catchAsyncHandler(async (req, res) => {
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
  getUsers = catchAsyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json({
      success: true,
      users,
    })
  })

  //@desc Delete  user profile
  //@route GET / api/users
  //@access Private
  deleteUser = catchAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      await user.remove()
      res.json({ message: 'User removed' })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
    res.json(users)
  })
  //@desc GET  user
  //@route GET / api/users/:id
  //@access Private
  getUserById = catchAsyncHandler(async (req, res) => {
    const users = await User.findById(req.params.id).select('-password')
    if (users) {
      res.json(users)
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
  //@desc UPDATE user profile
  //@route PUT / api/users/:id
  //@access Private
  updateUser = catchAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = req.body.isAdmin || user.isAdmin
      const updateUser = await user.save()
>>>>>>> a73761b66e2ea9f1d8e02f6207c0e20a514edfc9
      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
<<<<<<< HEAD
        token: generateToken(user._id),
      });
=======
      })
>>>>>>> a73761b66e2ea9f1d8e02f6207c0e20a514edfc9
    } else {
      res.status(401);
      throw new Error("User not found");
    }
<<<<<<< HEAD
  });

  //@desc GET all user profile
  //@route GET / api/users
  //@access Private
  getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  });
}

module.exports = new userControllers();
=======
  })
}

module.exports = new userControllers()
>>>>>>> a73761b66e2ea9f1d8e02f6207c0e20a514edfc9
