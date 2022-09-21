const mongoose = require("mongoose")

// 
const addressSchema = require("./Address").schema

// Schema
const UserSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
        unique: true,
        default: 0,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    addresses: [{
        type: addressSchema
    }],
    phone: String,
    name: String,
    gender: String,
    provider: {
        type: String,
        default: "TGDD",
    },
    // role
    role: {
        type: String,
        default: "USER",

    },
    enable: {
        type: Boolean,
        default: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
        require: true,
    }
})

// increase
// exports
module.exports.model = mongoose.model("user", UserSchema)
module.exports.schema = UserSchema