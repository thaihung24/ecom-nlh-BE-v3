const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "users"
        },
        name: String,
        award: String,
        color: String,
        banner: {
            url: String,
            public_id: String,
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        expireIn: {
            type: Date,
            required: true,
        }
    }, {
        timestamps: true
    })
    // Plugin
const Event = mongoose.model('Event', eventSchema)
module.exports = Event