const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  groupName: {
    type: String,
    trim: true,
  },
  lastMessage: {
    type: mongoose.Schema.ObjectId,
    ref: "Message",
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure conversations are indexed by participants for efficient queries
ConversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", ConversationSchema);
