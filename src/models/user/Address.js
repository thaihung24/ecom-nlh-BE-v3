const mongoose = require('mongoose')

const mongooseDelete = require('mongoose-delete')
// Schema
const AddressSchema = mongoose.Schema({
  province: {
    provinceID: {
      type: Number,
      require: [true, 'Missing provinceID'],
    },
    provinceName: {
      type: String,
      require: [true, 'Missing provinceName'],
    },
  },
  ward: {
    wardCode: {
      type: Number,
      require: [true, 'Missing wardCode'],
    },
    wardName: {
      type: String,
      require: [true, 'Missing wardName'],
    },
  },
  district: {
    districtID: {
      type: Number,
      require: [true, 'Missing districtID'],
    },
    districtName: {
      type: String,
      require: [true, 'Missing districtName'],
    },
  },
})
// plugin
AddressSchema.plugin(mongooseDelete, {
  overrideMethods: 'all',
  deleteAt: true,
})
// exports
let Address = mongoose.model('address', AddressSchema)
module.exports = Address

module.exports.schema = AddressSchema
