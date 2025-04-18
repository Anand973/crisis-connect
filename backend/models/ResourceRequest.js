const mongoose = require('mongoose');

const resourceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  resources: {
    medical: { type: Boolean, default: false },
    food: { type: Boolean, default: false },
    shelter: { type: Boolean, default: false }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

resourceRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ResourceRequest', resourceRequestSchema);