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
      "Sports and Fitness",
      "Creative and Visual Arts",
      "Music and Perfoming Arts",
      "Gaming & Entertainment",
      "Outdoor & Adventure",
      "Cooking",
      "Technology",
      "Community Activities",
      "Pet & Animal Enthusiasts",
      "Collections",
      "Other",
    ],
    default: "Other",
  },
  popularity: {
    type: Number,
    default: 0,
  },
  tags: [String],
  slug: {
    type: String,
    unique: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
