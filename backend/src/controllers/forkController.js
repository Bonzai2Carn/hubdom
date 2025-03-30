// backend/src/controllers/forkController.js

// Fork content
const forkContent = async (req, res) => {
    try {
      const { contentId, hobbyId } = req.body;
      
      // Check if content exists
      const content = await Content.findById(contentId);
      if (!content) {
        return res.status(404).json({
          success: false,
          error: "Content not found"
        });
      }
      
      // Create forked content
      const forkedContent = await ForkedContent.create({
        originalContent: contentId,
        title: content.title,
        description: content.description,
        forkedBy: req.user.id,
        hobby: hobbyId,
        interactionType: "discuss",
        teams: [
          { name: "Team A", color: "#3498DB", members: [] },
          { name: "Team B", color: "#E74C3C", members: [] },
          { name: "Team C", color: "#2ECC71", members: [] }
        ]
      });
      
      res.status(201).json({
        success: true,
        data: forkedContent
      });
    } catch (error) {
      console.error("Error forking content:", error);
      res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  };
  
  // Add comment
  const addComment = async (req, res) => {
    try {
      const { forkedContentId, text, interactionType, team } = req.body;
      
      // Check if forked content exists
      const forkedContent = await ForkedContent.findById(forkedContentId);
      if (!forkedContent) {
        return res.status(404).json({
          success: false,
          error: "Forked content not found"
        });
      }
      
      // Create comment
      const comment = await Comment.create({
        forkedContent: forkedContentId,
        user: req.user.id,
        text,
        team: team || null
      });
      
      // Add user to team if in debate mode
      if (interactionType === "debate" && team) {
        await ForkedContent.findOneAndUpdate(
          { _id: forkedContentId, "teams.name": team },
          { $addToSet: { "teams.$.members": req.user.id } }
        );
      }
      
      // Populate user data
      await comment.populate('user', 'name avatar');
      
      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  };
  
  // Vote on comment
  const voteOnComment = async (req, res) => {
    try {
      const { commentId, voteType } = req.body;
      
      // Check if comment exists
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          success: false,
          error: "Comment not found"
        });
      }
      
      // Handle upvote
      if (voteType === "upvote") {
        // Remove from downvotes if exists
        await Comment.findByIdAndUpdate(commentId, {
          $pull: { "votes.downvotes": req.user.id },
          $addToSet: { "votes.upvotes": req.user.id }
        });
      }
      // Handle downvote
      else if (voteType === "downvote") {
        // Remove from upvotes if exists
        await Comment.findByIdAndUpdate(commentId, {
          $pull: { "votes.upvotes": req.user.id },
          $addToSet: { "votes.downvotes": req.user.id }
        });
      }
      
      // Get updated comment
      const updatedComment = await Comment.findById(commentId)
        .populate('user', 'name avatar');
      
      res.status(200).json({
        success: true,
        data: updatedComment
      });
    } catch (error) {
      console.error("Error voting on comment:", error);
      res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  };
  
  // Get forked content comments
  const getComments = async (req, res) => {
    try {
      const { forkedContentId } = req.params;
      
      // Get comments sorted by vote score
      const comments = await Comment.find({ forkedContent: forkedContentId })
        .populate('user', 'name avatar')
        .sort({ voteScore: -1, createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
      });
    } catch (error) {
      console.error("Error getting comments:", error);
      res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  };