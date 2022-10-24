const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// Schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      // /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      require: [true, 'Please add a email'],
      unique: true,
    },
    password: {
      type: String,
      require: [true, 'Please add password'],
      //   select: false,
      minlength: 3,
    },
    addresses: [
      {
        idDefault: {
          type: Boolean,
          default: false,
        },
        address: {
          type: String,
          require: true,
        },
      },
    ],
    phone: String,
    name: String,
    gender: String,
    provider: {
      type: String,
      default: 'TGDD',
    },
    // role
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createAt: {
      type: Date,
      default: Date.now,
      require: true,
    },
  },
  {
    timestamps: true,
  }
)
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
// increase
// exports
let User = mongoose.model('users', UserSchema)
module.exports = User
module.exports.schema = UserSchema
