// src/routes/api/v1/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../../../controllers/chatControllers');
const { protect } = require('../../../middleware/authMiddleware');

// All chat routes should be protected
router.get('/event/:eventId', protect, chatController.getEventMessages);
router.post('/event/:eventId', protect, chatController.sendEventMessage);

module.exports = router;