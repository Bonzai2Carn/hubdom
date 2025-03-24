const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: "Team",
  },
  content: {
    type: String,
    required: [true, "Message content is required"],
    trim: true,
    maxlength: [1000, "Message cannot be more than 1000 characters"],
  },
  attachments: [
    {
      type: {
        type: String,
        enum: ["image", "video", "file"],
      },
      url: String,
    },
  ],
  readBy: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure messages are indexed by sender, team, and timestamp for efficient queries
MessageSchema.index({ sender: 1, team: 1, createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);
