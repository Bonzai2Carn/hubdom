const { Schema, model } = require('mongoose');

const HobbySchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a hobby name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  image: {
    type: String,
    default: "no-photo.jpg",
  },
  category: {
    type: String,
    enum: [
      "artistic", 
      "outdoor", 
      "physical", 
      "musical", 
      "tech-and-gadgets",
      "culinary", 
      "diy-and-craft", 
      "connection-based", 
      "spiritual-and-mindfulness",
      "scientific-and-intellectual", 
      "games-and-puzzles", 
      "collecting",
      "travel", 
      "mind", 
      "health", 
      "money-making",
    ],
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  popularity: {
    type: Number,
    default: 0,
  },
  membersCount: {
    type: Number,
    default: 0
  },
  eventsCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  slug: {
    type: String,
    unique: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Index for better query performance
HobbySchema.index({ category: 1, subcategory: 1 });
HobbySchema.index({ name: 'text', description: 'text' });
// Pre-save hook to update the updatedAt field and set the slug if not provided
HobbySchema.pre('save', function(next) {
  this.updatedAt = new Date();

  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-");
  }

  next();
});

const Hobby = model('Hobby', HobbySchema);

module.exports = Hobby;
