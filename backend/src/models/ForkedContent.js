// backend/src/models/ForkedContent.js

const ForkedContentSchema = new Schema({
    originalContent: {
      type: Schema.Types.ObjectId,
      ref: "Content",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    forkedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hobby: {
      type: Schema.Types.ObjectId,
      ref: "Hobby",
      required: true
    },
    interactionType: {
      type: String,
      enum: ["discuss", "debate"],
      default: "discuss"
    },
    teams: [{
      name: String,
      color: String,
      members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }]
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  module.exports = model('Forked', ForkedContentSchema);
  