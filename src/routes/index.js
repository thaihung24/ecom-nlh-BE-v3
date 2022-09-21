const authRoute = require("./authRoute");
//
function route(app) {

    // Auth
    app.use("/api/auth", authRoute)
}

module.exports = route;