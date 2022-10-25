const jwt = require("jsonwebtoken");
const catchAsyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const sendToken = require("../utils/jwtToken");
const User = require("../models/user/User").model;
//

class authController {
    // [POST] /login
    login = catchAsyncHandler(async(req, res, next) => {
        const {
            email,
            password
        } = req.body;
        // check empty 
        if (!email || !password) {
            return next(new ErrorResponse(`Missing email or password`, 400));
        }
        const user = await User.findOne({
            email
        }).select('+password')

        if (!user) return next(new ErrorResponse(`User not found`, 404));
        // Checks if password is correct or not
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid Email or Password', 401));
        }

        sendToken(user, 200, res)
    });
    //[POST] /register
    register = catchAsyncHandler(async(req, res, next) => {
        const {
            email,
            gender,
            name,
            phone,
            password,
            address,
            fullName,
            lastName
        } = req.body;
        if (!email | !password) {
            return next(new ErrorResponse(`Missing email or password`, 400));
        }

        const user = await User.findOne({
            email
        });

        if (user) return next(new ErrorResponse(`Existing email`, 400));

        const newUser = new User({
            email,
            password,
            addresses: [],
            gender,
            phone,
            name,
        })

        const newAddress = {
            address: address,
            idDefault: true,
        };

        newUser.addresses.push(newAddress);

        newUser.save((err, userData) => {
            if (err) {
                return next(
                    new ErrorResponse(`Cant save new user ${err.message}`, 404)
                );
            }
            sendToken(userData, 200, res)


        });
    });
    // [POST] /verify-email
    verify(req, res) {}
}

module.exports = new authController();