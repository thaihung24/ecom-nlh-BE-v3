const mongoose = require('mongoose')


const ItemSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    quantity: {
        type: Number,
        default: 1,
        required: [true, "Missing quantity line-item"]
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
})

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item
module.exports.schema = ItemSchema