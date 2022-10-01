const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/user/User").model;
//
const key = process.env.SECRET_KEY;

class authController {
    // [POST] /login
    login = asyncHandler(async(req, res, next) => {
        const { email, password } = req.body;
        // check empty
        if (!email || !password) {
            return next(new ErrorResponse(`Invalid input with Login`, 400));
        }
        User.findOne({ email }, (err, data) => {
            if (data) {
                res.status(200).send({
                    status: true,
                    data,
                });
            } else {
                return next(new ErrorResponse(`User not found ${err.message}`, 404));
            }
        });

    });
    //[POST] /register
    register = asyncHandler(async(req, res, next) => {
        const { email, gender, name, phone, password, address } = req.body;
        if (!email | !password) {
            return next(new ErrorResponse(`Missing email or password`, 400));
        }
        const newUser = new User({
            email,
            password,
            addresses: [],
            gender,
            phone,
            name,
        });
        User.findOne({ email }, (err, user) => {
            if (user) {
                return next(new ErrorResponse(`Existing email`, 400));
            } else {
                const accessToken = jwt.sign({ userId: newUser._id }, key);
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
                    } else {
                        res.status(200).send({
                            status: true,
                            data: userData,
                            accessToken,
                        });
                    }
                });
            }
        });
    });
    // [POST] /verify-email
    verify(req, res) {}
}

module.exports = new authController();