const mongoose = require('mongoose')
// SECRET
const USER = process.env.MONGO_USER
const PASSWORD = process.env.MONGO_PASSWORD

// connect

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
  } catch (e) {
    console.log(`Can't connect to DB. Error:${e.message}`)
    process.exit(1)
  }
}

module.exports = { connect }
