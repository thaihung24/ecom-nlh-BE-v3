// initial
const express = require('express')
const cookieParser = require('cookie-parser')

require('dotenv').config()
const app = express()

//cors
const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

// middle ware for dev log
const morgan = require('morgan')

if (process.env.NODE_ENV == 'develop') {
  app.use(morgan('dev'))
}
//
app.use(cookieParser())
//
app.use(express.json())
//routes
const route = require('./src/routes')

route(app)

// Error
const errorHandler = require('./src/middleware/error')
app.use(errorHandler)

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`ERROR: ${err.stack}`)
  console.log('Shutting down the server due to Unhandled Promise rejection')
  server.close(() => {
    process.exit(1)
  })
})
// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`ERROR: ${err.stack}`)
  console.log('Shutting down due to uncaught exception')
  process.exit(1)
})
// db
const db = require('./src/config/db')

db.connect()

//context
const PORT = process.env.PORT
//
app.listen(PORT || 5000, () => console.log('Server start on port ' + PORT))
