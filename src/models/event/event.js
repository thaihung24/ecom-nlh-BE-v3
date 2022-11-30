const mongoose = require('mongoose')

const eventSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    urlBanner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)
const Event = mongoose.model('Event', eventSchema)
module.exports = Event
