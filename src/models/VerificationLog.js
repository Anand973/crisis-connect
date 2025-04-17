import mongoose from 'mongoose';

const verificationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: String,
  documents: [{
    type: String, // URLs to verification documents
    required: function() {
      return this.status === 'verified';
    }
  }]
});

const VerificationLog = mongoose.model('VerificationLog', verificationLogSchema);

export default VerificationLog; 