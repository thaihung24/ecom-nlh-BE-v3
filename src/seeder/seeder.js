import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import products from '../data/products.js'
import Product from '../models/product/productModel.js'
import connectDB from '../config/db/index.js'
dotenv.config()

connectDB()

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
    await User.deleteMany()
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
