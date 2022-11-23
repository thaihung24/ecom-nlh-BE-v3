const Event = require('../models/event/event')
const Product = require('../models/product/productModel')
const catchAsyncHandler = require('../middleware/async')
const asyncHandler = require('express-async-handler')
const ErrorResponse = require('../utils/ErrorResponse')

class eventController {
  getListEvent = asyncHandler(async (req, res, next) => {
    const product = await Product.aggregate([
      {
        $group: {
          _id: { event: '$event' },
        },
      },
    ])
    res.json(product)
  })
}
module.exports = new eventController()
