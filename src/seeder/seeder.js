const mongoose = require('mongoose')
const dotenv = require('dotenv')
const colors = require('colors')
const products = require('../data/products')
const Product = require('../models/product/productModel.js')
const User = require('../models/user/User.js')
const users = require('../data/users.js')
const Order = require('../models/order/orderModal.js')
const Manufacturer = require('../models/manufacturer/manufacturer.js')
const manufacturers = require('../data/manufacturer')
const Color = require('../models/color/color.js')
const Colors = require('../data/colors.js')
const Category = require('../models/category/category.js')
const categories = require('../data/categories.js')
const subCategory = require('../models/subCategory/subCategory.js')
const subCategories = require('../data/subCategories.js')
const productOptions = require('../data/productOptions.js')
const image = require('../data/images.js')
const connectDB = require('../config/db')

dotenv.config()

connectDB.connect()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    await Manufacturer.deleteMany()
    await Color.deleteMany()
    await Category.deleteMany()
    await subCategory.deleteMany()
    const createUser = await User.insertMany(users)
    console.log('Inserted User')
    const adminUser = createUser[0]._id
    const sampleManufacturer = manufacturers.map((manufacturer) => {
      return { ...manufacturer, user: adminUser }
    })
    const createManufacturer = await Manufacturer.insertMany(sampleManufacturer)
    console.log('Inserted Manufacturer')
    const manufacturerId = createManufacturer[0]._id

    const sampleColors = Colors.map((color) => {
      return { ...color, user: adminUser }
    })
    const createColor = await Color.insertMany(sampleColors)
    console.log('Inserted Color')
    const sampleCategories = categories.map((category) => {
      return { ...category, user: adminUser }
    })
    const createCategory = await Category.insertMany(sampleCategories)
    console.log('Inserted Category')
    const categoryId = createCategory[0]._id
    const sampleSubCategories = subCategories.map((subCategory) => {
      return { ...subCategory, user: adminUser, category: categoryId }
    })
    const createSubcategory = await subCategory.insertMany(sampleSubCategories)
    console.log('Inserted subCategory')
    // const sampleOptions = productOptions.map((option) => {
    //   const colors = []
    //   createColor.map((color) => {
    //     if (color.name === 'Vàng') {
    //       const value = {
    //         color: createColor[0]._id,
    //         quantity: 10,
    //         images: image.imagesId1,
    //       }
    //       colors.push(value)
    //     } else if (color.name === 'Bạc') {
    //       const value = {
    //         color: createColor[1]._id,
    //         quantity: 10,
    //         images: image.imagesId2,
    //       }
    //       colors.push(value)
    //     } else if (color.name === 'Trắng') {
    //       const value = {
    //         color: createColor[2]._id,
    //         quantity: 10,
    //         images: image.imagesId3,
    //       }
    //       colors.push(value)
    //     } else if (color.name === 'Tím') {
    //       const value = {
    //         color: createColor[3]._id,
    //         quantity: 10,
    //         images: image.imagesId4,
    //       }
    //       colors.push(value)
    //     }
    //   })

    //   return { ...option, colors: colors }
    // })
    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
        manufacturer: manufacturerId,
        subCategory: createSubcategory[0]._id,
      }
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
