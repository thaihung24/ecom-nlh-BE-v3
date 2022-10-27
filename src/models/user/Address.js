const mongoose = require("mongoose");

// import
const UserSchema = require("./User").schema;
// Schema
const AddressSchema = mongoose.Schema({
    idDefault: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
        require: true,
    },
});
// exports
let Address = mongoose.model("address", AddressSchema);
module.exports = Address;

module.exports.schema = AddressSchema;

// plugin