const asyncHandler = require('express-async-handler')
const axios = require('axios')
const Order = require('../models/order/orderModal')
const Item = require('../models/cart/Item')
const ErrorResponse = require('../utils/ErrorResponse')
const Voucher = require('../models/voucher/voucher')
const Product = require('../models/product/productModel')
class CheckoutController {
  createCheckout = asyncHandler(async (req, res, next) => {
    try {
      //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
      //parameters
      const {
        shippingAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        voucher,
      } = req.body
      if (!shippingAddress) {
        return next(new ErrorResponse('shippingAddress not found', 400))
      }
      if (!shippingPrice) {
        return next(new ErrorResponse('shippingPrice not found', 400))
      }
      //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
      //parameters
      const items = await Item.find({
        user: req.user._id,
      })
      if (items && items.length === 0) {
        return next(new ErrorResponse('Items not found', 400))
      } else {
        const orderItems = []
        items.map((item) => {
          orderItems.push(item.item)
        })
        if (voucher) {
          const findVoucher = await Voucher.findById(voucher)

          if (findVoucher) {
            findVoucher.limit -= 1
            await findVoucher.save()
          } else {
            return next(new ErrorResponse('Voucher not found', 400))
          }
        }
        const order = new Order({
          orderItems,
          user: req.user._id,
          shippingAddress,
          paymentMethod: process.env.orderInfo,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          voucher,
        })
        const createdOrder = await order.save()
        if (createdOrder) {
          order.orderItems.map(async (item) => {
            const product = await Product.findById(item.product)
            product.productOptions.forEach((Option, index) => {
              if (Option._id.toString() === item.option.toString()) {
                Option.colors.forEach((color, i) => {
                  if (color._id.toString() === item.color.toString()) {
                    product.productOptions[index].colors[i].quantity -=
                      item.quantity
                  }
                })
              }
            })
            await product.save()
          })
          await Item.deleteMany({
            user: req.user._id,
          })
          var accessKey = process.env.accessKey
          var secretKey = process.env.secretKey
          var orderInfo = process.env.orderInfo
          var partnerCode = process.env.partnerCode
          var redirectUrl = process.env.redirectUrl
          var ipnUrl = process.env.ipnUrl
          var requestType = process.env.requestType
          var amount = '50000'
          var orderId = String(createdOrder._id)
          var requestId = String(req.user._id) + new Date().getTime()
          // var extraData = ''
          var orderGroupId = ''
          var autoCapture = true
          var lang = 'vi'
          var extraData = '' //pass empty value if your merchant does not have stores
          //before sign HMAC SHA256 with format
          //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
          var rawSignature =
            'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType
          //puts raw signature
          console.log('--------------------RAW SIGNATURE----------------')
          console.log(rawSignature)
          //signature
          const crypto = require('crypto')
          var signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex')
          console.log('--------------------SIGNATURE----------------')
          console.log(signature)
          //json object send to MoMo endpoint
          const requestBody = {
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            requestType: requestType,
            extraData: extraData,
            signature: signature,
            lang: lang,
          }
          try {
            const { data } = await axios.post(
              'https://test-payment.momo.vn:443/v2/gateway/api/create',
              requestBody
            )

            if (data.resultCode == 0) {
              await Order.updateOne(
                { _id: createdOrder._id },
                {
                  status: {
                    statusNow: 'Created Transaction.',
                    description:
                      'Đã tạo giao dịch, dang đợi người dùng thanh toán.',
                  },
                }
              )
            }
            console.log(data)
            res.status(200).json(data.payUrl)
          } catch (error) {
            await Order.deleteOne({ _id: createdOrder._id })
          }
          //Create the HTTPS objects

          // res.status(201).json(createdOrder)
        } else {
          if (voucher) {
            const findVoucher = await Voucher.findById(voucher)
            await findVoucher.save()
            if (findVoucher) {
              findVoucher.limit += 1
            }
          }
          return next(new ErrorResponse('Add order fail', 400))
        }
      }
    } catch (error) {
      return next(new ErrorResponse(error, 400))
    }
  })
  paymentNotification = asyncHandler(async (req, res, next) => {
    const { partnerCode, orderId, requestId } = req.body
    if (!partnerCode || !orderId || !requestId) {
      return next(new ErrorResponse(error, 400))
    }

    var rawSignature =
      'accessKey=' +
      process.env.accessKey +
      '&orderId=' +
      orderId +
      '&partnerCode=' +
      partnerCode +
      '&requestId=' +
      requestId
    const crypto = require('crypto')
    var signature = crypto
      .createHmac('sha256', process.env.secretKey)
      .update(rawSignature)
      .digest('hex')
    console.log('--------------------SIGNATURE----------------')
    console.log(signature)
    const requestBody = {
      partnerCode: partnerCode,
      requestId: requestId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    }
    const { data } = await axios.post(
      `https://test-payment.momo.vn:443/v2/gateway/api/create`,
      requestBody
    )
    console.log(data)
    res.status(200).json(data)
  })
  queryCheckout = asyncHandler(async (req, res, next) => {
    try {
      const { orderId, requestId } = req.body
      if (!orderId || !requestId) {
        return next(new ErrorResponse('Missed orderId or requestId', 400))
      }
      const order = await Order.findById(orderId)
      if (!order) {
        return next(new ErrorResponse('Not Found', 404))
      }
      if (order.user.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('401 Forbidden', 401))
      }
      var accessKey = process.env.accessKey
      var partnerCode = process.env.partnerCode
      var secretKey = process.env.secretKey
      var rawSignature =
        'accessKey=' +
        accessKey +
        '&orderId=' +
        orderId +
        '&partnerCode=' +
        partnerCode +
        '&requestId=' +
        requestId
      const crypto = require('crypto')
      var signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex')
      console.log('--------------------SIGNATURE----------------')
      console.log(signature)
      const requestBody = JSON.stringify({
        partnerCode: process.env.partnerCode,
        requestId: requestId,
        orderId: orderId,
        signature: signature,
        lang: 'vi',
      })

      // res.status(201).json(createdOrder)
      // Create the HTTPS objects
      const https = require('https')
      const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/query',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      }
      //Send the request and get the response
      var dataBody
      const request = https.request(options, (response) => {
        response.setEncoding('utf8')
        response.on('data', async (body) => {
          dataBody = body
          if (JSON.parse(body).resultCode == 0) {
            await Order.updateOne(
              { _id: orderId },
              {
                status: {
                  statusNow: `${JSON.parse(body).message}`,
                  description: 'Đã thanh toán thành công.',
                },
                isPaid: true,
                paidAt: Date.now(),
              }
            )
          } else if (JSON.parse(body).resultCode == 1000) {
            await Order.updateOne(
              { _id: orderId },
              {
                status: {
                  statusNow: `${JSON.parse(body).message}`,
                  description: `${JSON.parse(body).message}`,
                },
              }
            )
          } else if (JSON.parse(body).resultCode == 1003) {
            await Order.updateOne(
              { _id: orderId },
              {
                status: {
                  statusNow: `${JSON.parse(body).message}`,
                  description: `Giao dịch bị hủy bởi doanh nghiệp hoặc bởi trình xử lý timeout của MoMo. Vui lòng đánh dấu giao dịch này đã bị hủy (giao dịch thất bại).`,
                },
              }
            )
          } else {
            await Order.updateOne(
              { _id: orderId },
              {
                status: {
                  statusNow: `${JSON.parse(body).message}`,
                  description: `${JSON.parse(body).message}`,
                },
              }
            )
          }
        })
        response.on('end', () => {
          res.status(200).json(JSON.parse(dataBody))
        })
      })

      request.on('error', (e) => {
        return next(new ErrorResponse(e, 400))
      })
      // console.log(request)
      // write data to request body
      request.write(requestBody)
      request.end()
    } catch (error) {
      return next(new ErrorResponse(error, 400))
    }
  })
}
module.exports = new CheckoutController()
