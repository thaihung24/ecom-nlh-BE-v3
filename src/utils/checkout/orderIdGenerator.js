const orderIdGenerator = require('order-id')
const generateOrderId = () => {
  const generator = orderIdGenerator()
  return generator.generate()
}

export { generateOrderId }
