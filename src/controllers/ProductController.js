const Product = require('../models/product/productModel')
const asyncHandler = require('express-async-handler')

class ProductController {
  //[GET] /api/products
  // @desc    Fetch single product
  // @route   GET /api/products/
  // @access  Public
  index = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    if (products) {
      res.json(products)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
  getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
}
module.exports = new ProductController()
