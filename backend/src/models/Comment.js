// backend/src/models/Comment.js

const CommentSchema = new Schema({
    forkedContent: {
      type: Schema.Types.ObjectId,
      ref: "ForkedContent",
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    text: {
      type: String,
      required: true
    },
    team: {
      type: String,
      default: null // For debate mode
    },
    votes: {
      upvotes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }],
      downvotes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
      }]
    },
    createdAt: { type: Date, default: Date.now }
  });
  
  // Virtual fields
  CommentSchema.virtual('voteScore').get(function() {
    return this.votes.upvotes.length - this.votes.downvotes.length;
  });
  
  // Indexes
  CommentSchema.index({ forkedContent: 1, createdAt: -1 });
  