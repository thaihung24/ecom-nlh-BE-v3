// Error
const ErrorResponse = require('../utils/ErrorResponse')
    //Main route
const authRoute = require('./authRoute')
const productRoute = require('./productRoute')
const userRoute = require('./userRoute')
const orderRoute = require('./orderRoute')
    //
function route(app) {
    //Oder
    app.use('/api/orders', orderRoute)
        //PAYPAL_CLIENT_ID
    app.get('/api/config/paypal', (req, res) => {
        res.send(process.env.PAYPAL_CLIENT_ID)
    })
    app.use('/api/users', userRoute)
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