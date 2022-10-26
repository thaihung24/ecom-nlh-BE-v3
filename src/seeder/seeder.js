const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const products = require('../data/products')
const Product = require('../models/product/productModel.js')
const User = require('../models/user/User.js')
const users = require('../data/users.js')
const connectDB = require('../config/db')

dotenv.config()

connectDB.connect()

const importData = async () => {
  try {
    await User.deleteMany()
    await Product.deleteMany()
    const createUser = await User.insertMany(users)
    const adminUser = createUser[0]._id
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })
    await Product.insertMany(sampleProducts)
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
