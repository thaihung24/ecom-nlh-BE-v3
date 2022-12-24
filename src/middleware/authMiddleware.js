const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/ErrorResponse')
const catchAsyncHandler = require('../middleware/async')
const User = require('../models/user/User')

const protect = catchAsyncHandler(async(req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            return next(new ErrorResponse('UnAuthenticated token failed', 401))
        }
    }
    if (!token) {
        return next(new ErrorResponse('UnAuthenticated, no token', 401))
    }
})

const admin = (req, res, next) => {
    if (!(req.user && req.user.isAdmin)) {
        return next(new ErrorResponse('UnAuthorization, no admin'))
    }
    next()
}

module.exports = {
    protect,
    admin
}