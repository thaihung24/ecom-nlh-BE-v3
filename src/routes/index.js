// Error
const ErrorResponse = require('../utils/ErrorResponse')
//Main route
const authRoute = require('./authRoute')
const productRoute = require('./productRoute')
//
function route(app) {
  // Auth
  app.use('/api/auth', authRoute)
  //product
  app.use('/api/products', productRoute)
  // main
  app.use('/', (req, res, next) => {
    next(new ErrorResponse(`Page not found`, 404, null, 'Not found'))
  })
}

module.exports = route
