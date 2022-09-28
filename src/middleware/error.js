const ErrorResponse = require("../utils/ErrorResponse")

const errorHandler = (err, req, res, next) => {
    // Bad request
    let error = {...err };
    error.message = err.message;
    if ((error.name = "Error")) {
        if (error.statusCode == "400") {
            error.serverMessage = "Bad request";
        } else if (error.statusCode == "404") {
            error.serverMessage = "Not found";
        } else if (error.statusCode == "200") {
            error.serverMessage =
                "Success, but Server is not working right, Try again";
        }
    } else {
        const message = `Resource not found with message: ${error.value}`;
        error = new ErrorResponse(message, 500);
    }
    // Print to log
    // console.log(err.stack);
    console.log(error);
    // Actually response
    res.status(err.statusCode || 500).json({
        success: false,
        data: err.data || [],
        message: error.message || "Server Error",
        serverMessage: error.serverMessage || "Internal Server Error",
    });
};

module.exports = errorHandler;