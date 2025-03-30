const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [30, "Username cannot be more than 30 characters"],
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  bio: {
    type: String,
    maxlength: [500, "Bio cannot be more than 500 characters"],
  },
  avatar: {
    type: String,
    default: "default-avatar.jpg",
  },
  avatarType: {
    type: String,
    enum: [
      'Competitor', 'Visionary', 'Maestro', 'Strategist', 'Connector', 
      'Gourmet', 'Chef', 'Explorer', 'Scholar', 'Maker', 'Curator', 
      'Sage', 'Tinkerer', 'Animal Advocate', 'Wanderer', 'Digital Nomad'
    ],
    default: 'Explorer',
  },
  displayName: {
    type: String,
    trim: true,
  },
  notificationPreferences: {
    events: {
      type: Boolean,
      default: true
    },
    messages: {
      type: Boolean,
      default: true
    },
    nearbyActivities: {
      type: Boolean,
      default: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
  },
  hobbies: [{
    hobby: {
      type: Schema.Types.ObjectId,
      ref: "Hobby"
    },
    proficiencyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner"
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Social auth fields
  googleId: String,
  facebookId: String,
  twitterId: String,
  
  // Location sharing settings
  locationSharingEnabled: {
    type: Boolean,
    default: false,
  },
  geofenceRadius: {
    type: Number,
    default: 5000, // 5km in meters
  },
  lastLocationUpdate: Date,
  
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check if password matches
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = model('User', UserSchema);
