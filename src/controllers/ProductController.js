const Product = require('../models/product/productModel')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require("../utils/ErrorResponse")
const APIFeatures = require('../utils/ApiFeature')
class ProductController {
  //[GET] /api/products
    // @desc    Fetch single product
    // @route   GET /api/products/
    // @access  Public
    index = asyncHandler(async(req, res) => {
        const size = req.query.size || 5;
        const page = req.query.page || 1;


        const apiFeatures = new APIFeatures(Product.find({}), req.query).search().filter();
        let products = await apiFeatures.query;
        // Pagination

        if (!products) return next(new ErrorResponse('Product not found', 404))

        apiFeatures.pagination(size, page)
        products = await apiFeatures.query.clone();

        res.status(200).json({
            success: true,
            products,
            message: "Get products"
        })
    })
  getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.json(product.productOptions)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
  // @desc    Delete a product
  // @route   DELETE /api/products/:id
  // @access  Private/Admin
  deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
      await product.remove()
      res.json({ message: 'Product removed' })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })

  // @desc    Create a product
  // @route   POST /api/products
  // @access  Private/Admin
  createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      manufacturer: Object('6357f372365d2d6acb7fb140'),
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  })

  // @desc    Update a product
  // @route   PUT /api/products/:id
  // @access  Private/Admin
  updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } =
      req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      product.name = name
      product.price = price
      product.description = description
      product.image = image
      product.brand = brand
      product.category = category
      product.countInStock = countInStock

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })

  // @desc    Create new review
  // @route   POST /api/products/:id/reviews
  // @access  Private
  createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      )

      if (alreadyReviewed) {
        res.status(400)
        throw new Error('Product already reviewed')
      }
      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      }
      console.log(review)
      product.reviews.push(review)

      product.numReviews = product.reviews.length

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length

      await product.save()
      res.status(201).json({ message: 'Review added' })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })

  // @desc    Get top rated products
  // @route   GET /api/products/top
  // @access  Public
  getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    res.json(products)
  })
}
module.exports = new ProductController()