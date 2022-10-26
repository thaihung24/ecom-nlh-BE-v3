// Error
const ErrorResponse = require("../utils/ErrorResponse")
    //Main route
const authRoute = require("./authRoute");
// 
//
function route(app) {
    // Auth
    app.use("/api/auth", authRoute);
    // main
    app.use("/", (req, res, next) => {
        next(new ErrorResponse(`Page not found`, 404))
    })
}

module.exports = route;