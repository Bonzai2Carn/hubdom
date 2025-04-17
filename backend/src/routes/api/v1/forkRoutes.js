// src/routes/api/v1/eventRoutes.js
const express = require('express');
const router = express.Router();
const forkController = require('../../../controllers/forkController');
const { protect } = require('../../../middleware/authMiddleware');

// Public routes
router.post("/fork", protect, forkController.forkContent);
router.post("/comment", protect, forkController.addComment);
router.post("/vote", protect, forkController.voteOnComment);
router.get("/comments/:forkedContentId", forkController.getComments);


module.exports = router;