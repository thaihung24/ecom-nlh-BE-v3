// initial
const express = require("express")
require("dotenv").config();
const app = express();
app.use(express.json())
    //routes 
const route = require("./src/routes")
route(app);
// db
const db = require("./src/config/db");
db.connect();


//context 
const PORT = process.env.PORT;
//
app.listen(PORT || 5000, () => console.log("Server start on port " + PORT));