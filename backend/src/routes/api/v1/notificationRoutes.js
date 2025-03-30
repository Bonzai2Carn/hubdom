// backend/src/routes/api/v1/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../../../controllers/notificationController');
const { protect } = require('../../../middleware/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

router.get('/', notificationController.getUserNotifications);
router.put('/:id/read', notificationController.markNotificationRead);
router.put('/read-all', notificationController.markAllNotificationsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;