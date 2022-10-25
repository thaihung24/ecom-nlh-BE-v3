const mongoose = require("mongoose");
const slugify = require("slugify");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const ErrorResponse = require("../../utils/ErrorResponse");
// Schema
const UserSchema = new mongoose.Schema({
    email: {
        // /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
        require: [true, "Please add a email"],
        unique: true,
    },
    password: {
        type: String,
        require: [true, "Please add password"],
        select: false,
        minlength: 3,
    },
    addresses: [{
        idDefault: {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
            require: true,
        },
    }, ],
    phone: String,
    name: String,
    fullName: String,
    firstName: String,
    lastName: String,
    gender: String,
    provider: {
        type: String,
        default: "TGDD",
    },
    // role
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    enable: {
        type: Boolean,
        default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createAt: {
        type: Date,
        default: Date.now,
        require: true,
    },
}, {
    timestamps: true,
});

// Slugify
UserSchema.pre("save", function(next) {
    let fullNameRaw = this.firstName ? `${this.firstName} ${this.lastName}` : this.name
    this.fullName = slugify(fullNameRaw, {
        replacement: "-",
        trim: true,
        lower: true,
    })
    next();
});

// generate access token
UserSchema.methods.getJwtToken = function() {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};
// Encrypting password before saving user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// Compare user password
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};
// exports
let User = mongoose.model("users", UserSchema);
module.exports.model = User;
module.exports.schema = UserSchema;