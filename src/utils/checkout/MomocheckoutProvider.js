const axios = require('axios')
const { generateOrderId } = require('./orderIdGenerator')

class MomoCheckoutProvider {
  createLink = async (
    amount,
    userInfo,
    redirectHost,
    ipnHost,
    extraData = ''
  ) => {
    const partnerCode = process.env.partnerCode
    const accessKey = process.env.accessKey
    const secretKey = process.env.secretKey

    console.log(redirectHost, ipnHost)
    const redirectUrl = `${redirectHost}/account/order`
    const ipnUrl = `${ipnHost}/checkout/notifyMomo`

    const orderId = generateOrderId()
    const orderInfo = `Pay for order ID ${orderId} with Momo`
    const requestId = partnerCode + new Date().getTime()

    const requestType = 'captureWallet'

    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${amount}`,
      `extraData=${extraData}`,
      `ipnUrl=${ipnUrl}`,
      `orderId=${orderId}`,
      `orderInfo=${orderInfo}`,
      `partnerCode=${partnerCode}`,
      `redirectUrl=${redirectUrl}`,
      `requestId=${requestId}`,
      `requestType=${requestType}`,
    ].join('&')
    const crypto = require('crypto')
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')
    console.log('--------------------SIGNATURE----------------')
    console.log(signature)

    const requestBody = {
      accessKey: accessKey,
      amount: amount,
      extraData: extraData,
      ipnUrl: ipnUrl,
      orderId: orderId,
      orderInfo: orderInfo,
      partnerCode: partnerCode,
      redirectUrl: redirectUrl,
      requestId: requestId,
      requestType: requestType,
      userInfo: userInfo,
      signature: signature,
    }
    const response = await axios.post(
      'https://test-payment.momo.vn:443/v2/gateway/api/create',
      requestBody
    )
    const { payUrl } = response.data
    return [orderId, payUrl]
  }

  queryPayment = async (requestId, orderId) => {
    const partnerCode = process.env.partnerCode
    const accessKey = process.env.accessKey
    const secretKey = process.env.secretKey
    const lang = 'en'

    const rawSignature = [
      `accessKey=${accessKey}`,
      `orderId=${orderId}`,
      `partnerCode=${partnerCode}`,
      `requestId=${requestId}`,
    ].join('&')
    const crypto = require('crypto')
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')
    console.log('--------------------SIGNATURE----------------')
    console.log(signature)
    const requestBody = {
      partnerCode: partnerCode,
      requestId: requestId,
      orderId: orderId,
      lang: lang,
      signature: signature,
    }

    try {
      const response = await axios.post(
        'https://test-payment.momo.vn:443/v2/gateway/api/query',
        requestBody
      )

      const { data } = response
      console.log(data)
    } catch (err) {
      console.error(err.response.data)
    }
  }

  verifyIpnSignature = (body) => {
    const accessKey = process.env.accessKey
    const secretKey = process.env.secretKey

    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = body
    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${amount}`,
      `extraData=${extraData}`,
      `message=${message}`,
      `orderId=${orderId}`,
      `orderInfo=${orderInfo}`,
      `orderType=${orderType}`,
      `partnerCode=${partnerCode}`,
      `payType=${payType}`,
      `requestId=${requestId}`,
      `responseTime=${responseTime}`,
      `resultCode=${resultCode}`,
      `transId=${transId}`,
    ].join('&')
    const crypto = require('crypto')
    const correctSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')
    console.log('--------------------SIGNATURE----------------')
    console.log(rawSignature, correctSignature)
    return correctSignature === signature
  }

  capturePayment = async (requestId, orderId, amount) => {
    const partnerCode = process.env.partnerCode
    const accessKey = process.env.accessKey
    const secretKey = process.env.secretKey
    const requestType = 'capture'
    const description = ''
    const lang = 'en'

    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${amount}`,
      `description=${description}`,
      `orderId=${orderId}`,
      `partnerCode=${partnerCode}`,
      `requestId=${requestId}`,
      `requestType=${requestType}`,
    ].join('&')
    const crypto = require('crypto')
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex')
    console.log('--------------------SIGNATURE----------------')

    const requestBody = {
      partnerCode: partnerCode,
      requestId: requestId,
      orderId: orderId,
      requestType: requestType,
      amount: amount,
      lang: lang,
      description: description,
      signature: signature,
    }

    try {
      const response = await axios.post(
        'https://test-payment.momo.vn:443/v2/gateway/api/confirm',
        requestBody
      )

      const { data } = response
    } catch (err) {
      console.error(err.response.data)
    }
  }

  getCurrency = () => {
    return config.currency.VND
  }
}

export default MomoCheckoutProvider
