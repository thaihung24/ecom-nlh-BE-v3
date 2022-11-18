const Product = require('../models/product/productModel')
const Manufacturer = require('../models/manufacturer/manufacturer')
const SubCategory = require('../models/subCategory/subCategory')
const Category = require('../models/category/category')
const Comment = require('../models/comment/comment')
const asyncHandler = require('../middleware/async')



class ProductController {
  //[GET] /api/products

  // @desc    Fetch single product
  // @route   GET /api/products/
  // @access  Public
  index = asyncHandler(async (req, res) => {
    const pageSize = 10
    const page = Number(req.query.page) || 1
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}
    const count = await Product.count({ ...keyword })
    const products = await Product.find({ ...keyword })
      .select('name price rating')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
    if (products) {
      res.json({ products, page, pages: Math.ceil(count / pageSize) })
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })

  getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    const manufacturer = await Manufacturer.findById(product.manufacturer)
    product.manufacturer = manufacturer.name
    const subCategory = await SubCategory.findById(product.subCategory)
    product.subCategory = subCategory.name
    const category = await Category.findById(subCategory.category)
    const comments = await Comment.find({ product: product._id })

    if (product) {
      const result = {
        _id: product._id,
        manufacturer: manufacturer.name,
        name: product.name,
        image: product.image,
        video: product.video,
        productOptions: product.productOptions,
        description: product.description,
        subCategory: subCategory.name,
        category: category.name,
        comments: comments,
        rating: product.rating,
        price: product.price,
        detailSpecs: product.detailSpecs,
        countInStock: product.countInStock,
        numberReview: product.numberReview,
        reviews: product.reviews,
      }
      // product.comments = comments
      // res.json({ ...product, category: category.name })
      res.status(200).json(result)
    } else {
      res.status(404)
      throw new Error('Product not found')
    }
  })
  // @desc    get product By category
  // @route   GET /api/products/category/:slug
  // @access  Public
  getProductsByCategory = asyncHandler(async (req, res) => {
    const product = await Product.find({})
      .populate({
        path: 'subCategory',
        match: { category: req.params.slug },
      })
      .select('name image rating price ')
    const result = []
    product.map((item, index) => {
      if (item.subCategory !== null) {
        result.push(item)
      }
    })

    res.json(result)
  })
  // @desc    get product By category
  // @route   GET /api/products/subcategory/:id
  // @access  Public
  getProductsBySubCategory = asyncHandler(async (req, res) => {
    const product = await Product.find({
      subCategory: req.params.id,
    }).select('name image rating price')
    if (product) {
      res.status(201).json({
        success: true,
        product,
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'product not found',
      })
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
        product.reviews.forEach((review) => {
          if (review.user.toString() === req.user._id.toString()) {
            review.comment = comment
            review.rating = rating
          }
        })
      } else {
        const review = {
          user: req.user._id,
          name: req.user.name,
          avatarUrl: req.user.avatar.url,
          rating: Number(rating),
          comment,
        }

        product.reviews.push(review)
      }
      product.numReviews = product.reviews.length

      product.rating = product.reviews.reduce(
        (acc, item) => item.rating + acc,
        0
      )
      product.rating = product.rating / product.reviews.length

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