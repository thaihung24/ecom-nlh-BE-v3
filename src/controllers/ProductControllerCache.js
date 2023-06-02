// 'use strict'
// const redis = require('redis')
// const config = {
//   host: process.env.REDIS_HOST || process.env.IP || '127.0.0.1',
//   port: process.env.REDIS_PORT || 6379,
// }
// const asyncHandler = require('../middleware/async')

// // client.getAsync = util.promisify(client.get).bind(client)
// // client.setAsync = util.promisify(client.set).bind(client)
// class ProductControllerCache {
//   constructor() {
//     this._client = redis.createClient(config)
//     this._api = require('./ProductController')
//     console.log(config)
//   }
//   index = asyncHandler(async (req, res) => {
//     const keyword = req.query.keyword ? req.query.keyword : ''
//     const pageSize = req.query.size || 10
//     const page = Number(req.query.page) || 1
//     const key = `getProducts-${keyword}-${pageSize}-${page}`
//     await this._getFromCache(
//       key,
//       this._api.index.bind(this._api, req, res)
//     ).then(function (response) {
//       res.json(response)
//     })
//   })
//   getProductsByCategory = asyncHandler(async (req, res) => {
//     const key = `getProductsByCategory-${req.params.slug}`
//     await this._getFromCache(
//       key,
//       this._api.getProductsByCategory.bind(this._api, req, res)
//     ).then(function (response) {
//       res.json(response)
//     })
//   })

//   _getFromCache(key, boundFunction) {
//     const client = this._client
//     return new Promise((resolve, reject) => {
//       client.get(key, async (err, reply) => {
//         if (err) {
//           reject(err)
//           return
//         }
//         if (reply === null) {
//           console.log('Cache miss: ' + key)
//           await boundFunction().then(function (result) {
//             client.set(key, JSON.stringify(result))
//             resolve(result)
//           })
//         } else {
//           console.log('Cache hit: ' + key)
//           resolve(JSON.parse(reply))
//         }
//       })
//     })
//   }
// }
// module.exports = new ProductControllerCache()
