const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const products = require('../data/products')
const Product = require('../models/product/productModel.js')
const connectDB = require('../config/db')

dotenv.config()

connectDB.connect()

const importData = async () => {
  try {
    await Product.deleteMany()
    await Product.insertMany(products)
    console.log('Data Imported successfully'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Product.deleteMany()
    console.log('Data destroy successfully'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
