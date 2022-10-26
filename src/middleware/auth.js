const ErrorResponse = require("../utils/ErrorResponse")
const catchAsyncHandler = require("../middleware/async")
const jwt = require("jsonwebtoken")
const User = require("../models/user/User").model;
const verifyToken = catchAsyncHandler(async(req, res, next) => {
    // const authHeader = req.header("Authorization")
    const authHeader = req.header("Authorization")
    const token = req.cookies.accessToken || authHeader && authHeader.split(" ")[1];
    // const {
    //     token
    // } = req.cookies
    if (!token) {

        //401 Unauthorized
        return next(new ErrorResponse('Login first to access this resource.', 401))
    }
    try {
        //jwt.verify(token,secret key)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        //get decode and dispatcher it with request
        req.user = await User.findById(decoded.userId);
        //Pass
        next();
    } catch (e) {
        //403 forbidden
        return next(new ErrorResponse("Invalid token", 403))
    }

})

module.exports = verifyToken