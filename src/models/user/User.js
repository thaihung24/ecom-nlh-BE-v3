const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../../utils/geocoder")
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
    addressTest: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
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
// Geocoder to create location field
UserSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.addressTest);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        country: loc[0].countryCode,
        zipcode: loc[0].zipcode,

    }

    // Don't save address in DC
    this.addressTest = undefined;

    next();
});


// exports
let User = mongoose.model("users", UserSchema);
module.exports.model = User;
module.exports.schema = UserSchema;