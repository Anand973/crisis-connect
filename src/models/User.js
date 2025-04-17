import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['volunteer', 'organization', 'admin'],
    default: 'volunteer'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: String, // URLs to stored documents
    required: function() {
      return this.role === 'organization';
    }
  }],
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert']
    },
    certification: String
  }],
  resources: [{
    name: String,
    type: String,
    quantity: Number,
    availability: {
      type: String,
      enum: ['available', 'in_use', 'unavailable']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  }],
  contactInfo: {
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  availability: {
    type: String,
    enum: ['full_time', 'part_time', 'on_call'],
    default: 'on_call'
  },
  preferredLanguages: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  privacySettings: {
    showLocation: {
      type: Boolean,
      default: true
    },
    showContact: {
      type: Boolean,
      default: false
    },
    showSkills: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries on resources
userSchema.index({ 'resources.location': '2dsphere' });

// Method to check if user has required permissions
userSchema.methods.hasPermission = function(permission) {
  const permissions = {
    admin: ['manage_users', 'manage_crises', 'verify_users', 'view_analytics'],
    organization: ['manage_resources', 'create_crises', 'manage_volunteers'],
    volunteer: ['view_crises', 'offer_help', 'update_status']
  };
  
  return permissions[this.role]?.includes(permission) || false;
};

// Method to update verification status
userSchema.methods.updateVerificationStatus = async function(status, adminId) {
  this.verificationStatus = status;
  if (status === 'verified') {
    this.isVerified = true;
  }
  await this.save();
  
  // Log verification action
  await VerificationLog.create({
    userId: this._id,
    status,
    updatedBy: adminId,
    timestamp: new Date()
  });
};

const User = mongoose.model('User', userSchema);

export default User; 