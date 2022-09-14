const mongoose = require("mongoose");

// import
const UserSchema = require("./User").schema
    // Schema
const AddressSchema = mongoose.Schema({
        id: {
            type: Number,
            require: true,
            unique: true,
        },
        idDefault: {
            type: Boolean,
            default: false,
        },
        address: String,
    })
    // exports
module.exports.model = mongoose.model("address", AddressSchema)

module.exports.schema = AddressSchema

// plugin