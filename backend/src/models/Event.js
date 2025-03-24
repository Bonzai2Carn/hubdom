const { Schema, model } = require('mongoose');

const EventSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please add an event title"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  hobby: {
    type: Schema.Types.ObjectId,
    ref: "Hobby",
    required: true,
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  startDate: {
    type: Date,
    required: [true, "Please add a start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Please add an end date"],
  },
  capacity: {
    type: Number,
    default: 10,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  image: {
    type: String,
    default: "no-photo.jpg",
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update the updatedAt field
EventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add indexes for efficient queries
EventSchema.index({ hobby: 1 });
EventSchema.index({ organizer: 1 });
EventSchema.index({ startDate: 1 });
EventSchema.index({ "location.coordinates": "2dsphere" });

module.exports = model('Event', EventSchema);
