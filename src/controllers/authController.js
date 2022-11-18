const crypto = require("crypto");
//middleware
const catchAsyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const sendToken = require("../utils/jwtToken");
const User = require("../models/user/User");
//
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken.js");
const passport = require("passport");
const Address = require("../models/user/Address");
class authController {
  // [POST] /login
  login = catchAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // check empty
    if (!email || !password) {
      return next(new ErrorResponse(`Missing email or password`, 400));
    }
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user) return next(new ErrorResponse(`User not found`, 404));
    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorResponse(`Invalid Email or Password`, 401));
    }

    sendToken(user, 200, res);
  });
  //[POST] /register
  register = catchAsyncHandler(async (req, res, next) => {
    const { email, password, gender, addressForm, phone, name } = req.body;
    if (!email | !password) {
      return next(new ErrorResponse(`Missing email or password`, 400));
    }
    const user = await User.findOne({
      email: email,
    });

    if (user) return next(new ErrorResponse(`Existing email`, 400));

    const newUser = new User({
      email,
      password,
      addresses: [],
      gender,
      phone,
      name,
    });

    const newAddress = await Address.create(addressForm.detailAddress);
    addressForm.detailAddress = newAddress;
    newUser.addresses.push({
      ...addressForm,
      address: `${addressForm.address}, ${newAddress.ward.wardName}, ${newAddress.district.districtName}, ${newAddress.province.provinceName}`,
      detailAddress: newAddress,
    });
    console.log(newUser);
    const verifyToken = newUser.verifyEmailToken();
    await newUser.save();

    // send email
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verifyToken}`;
    const resetUrl = `${process.env.CLIENT_URL}/api/auth/verify-email/${verifyToken}`;

    const message = `Your verify token for active ${newUser.fullName} is as follow:\n\n${resetUrl}\n\nLink will be expired after 30 minutes\n\nIf you have not requested this email, then ignore it.`;

    try {
      await sendEmail({
        email: newUser.email,
        subject: "HLN website Email Verify",
        message: message,
      });
      res.status(200).json({
        success: true,
        user: newUser,
        message: `Email sent to: ${newUser.email}, account will be removed from system after 30 minutes without verify`,
      });
    } catch (e) {
      newUser.emailCodeExpires = undefined;
      newUser.emailCodeToken = undefined;
      await newUser.save({
        validateBeforeSave: false,
      });

      return next(new ErrorResponse(e.message, 500));
    }
  });
  // [POST] /verify-email/:token
  verifyEmail = catchAsyncHandler(async (req, res, next) => {
    const { token } = req.params;

    // Hash URL token
    const verifyToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailCodeToken: verifyToken,
      emailCodeExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return next(
        new ErrorResponse("Verify token is invalid or has been expired", 400)
      );
    }
    user.enable = true;
    await user.save({
      validateBeforeSave: false,
    });
    sendToken(user, 200, res);
  });
  //#### OAUTH2
  // Google
  googleAuth = catchAsyncHandler(async (req, res, next) => {
    return passport.authenticate("google");
  });
}

module.exports = new authController();
