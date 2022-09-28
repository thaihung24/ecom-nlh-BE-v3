// initial
const express = require("express");
require("dotenv").config();
const app = express();

// middle ware for dev log
const morgan = require("morgan");

if (process.env.NODE_ENV == "develop") {
    app.use(morgan("dev"));
}

//
app.use(express.json());
//routes
const route = require("./src/routes");

route(app);

// Error
const errorHandler = require("./src/middleware/error");
app.use(errorHandler);
// db
const db = require("./src/config/db");
db.connect();

//context
const PORT = process.env.PORT;
//
app.listen(PORT || 5000, () => console.log("Server start on port " + PORT));