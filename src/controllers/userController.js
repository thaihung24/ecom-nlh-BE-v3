const ErrorResponse = require("../utils/ErrorResponse")
const catchAsyncHandler = require("../middleware/async")


exports.getUserInfo = catchAsyncHandler(async(req, res, next) => {

    res.json({
        success: true,
        data: [],
        message: "Get user info"
    })

})