const ErrorResponse = require('../utils/ErrorResponse')
const User = require('../models/user/User')
const Address = require("../models/user/Address")
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
                message: 'User Info',
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
        // 
        const {
            addressID,
            name,
            phone,
            gender,
            addresses,
            isNew,
        } = req.body

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.gender = gender || user.gender;
        // 
        if (isNew) {
            // Add address
            const address = await Address.create({
                ...addresses[0].detailAddress,
            })
            user.addresses.push({
                ...addresses[0],
                detailAddress: address,
            })
        } else {
            // Update address
            const {
                editAddress
            } = req.body
            if (editAddress) {
                const newAddress = user.addresses.filter(address => address.detailAddress._id != editAddress)
                const address = await Address.create({
                    ...addresses[0].detailAddress,
                })
                newAddress.push({
                    ...addresses[0],
                    detailAddress: address,
                })
                user.addresses = newAddress

            }
        }

        const updateUser = await user.save()

        res.status(200).json({
            success: true,
            message: 'User updated',
            user: updateUser,
        })
    })

    // ##DELETE ADDRESS
    // DELETE /api/users/address/:addressID
    deleteAddress = catchAsyncHandler(async(req, res) => {
            const {
                addressID
            } = req.params
            const user = await User.findById(req.user.id)

            const addresses = user.addresses.filter((v) => v.detailAddress._id != addressID)

            user.addresses = addresses

            await user.save()

            res.status(200).json({
                success: true,
                message: 'Address deleted'
            })

        })
        // ##PUT ADDRESS
        // PUT /api/users/address/:addressID
    updateAddress = catchAsyncHandler(async(req, res) => {
            const {
                addressID
            } = req.params

            const user = await User.findById(req.user.id)

            const addresses = user.addresses.filter((v) => v.detailAddress._id != addressID)

            user.addresses = addresses

            await user.save()

            res.status(200).json({
                success: true,
                message: 'Address deleted'
            })

        })
        //@desc GET all user profile
        //@route GET / api/users
        //@access Private
    getUsers = catchAsyncHandler(async(req, res) => {
        const users = await User.find({})
        res.json({
            success: true,
            users,
        })
    })

    //@desc Delete  user profile
    //@route GET / api/users
    //@access Private
    deleteUser = catchAsyncHandler(async(req, res) => {
            const user = await User.findById(req.params.id)
            if (user) {
                await user.remove()
                res.json({
                    message: 'User removed'
                })
            } else {
                res.status(404)
                throw new Error('User not found')
            }
            res.json(users)
        })
        //@desc GET  user
        //@route GET / api/users/:id
        //@access Private
    getUserById = catchAsyncHandler(async(req, res) => {
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
    updateUser = catchAsyncHandler(async(req, res) => {
        const user = await User.findById(req.params.id)
        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.isAdmin = req.body.isAdmin || user.isAdmin
            const updateUser = await user.save()
            res.json({
                _id: updateUser._id,
                name: updateUser.name,
                email: updateUser.email,
                isAdmin: updateUser.isAdmin,
            })
        } else {
            res.status(401)
            throw new Error('User not found')
        }
    })
}

module.exports = new userControllers()
