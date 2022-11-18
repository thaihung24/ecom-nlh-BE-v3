const mongoose = require('mongoose')

const ItemSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    item: {
        quantity: {
            type: Number,
            default: 1,
            required: [true, 'Missing quantity line-item'],
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
        color: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        option: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
})

const Item = mongoose.model('Item', ItemSchema)
module.exports = Item