const mongoose = require('mongoose')
const Product = require('../product/productModel')

const eventSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    urlBanner: {
        type: String,
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
})
const Event = mongoose.model('Event', eventSchema)
module.exports = Event