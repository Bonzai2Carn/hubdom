const express = require('express');
const router = express.Router();
const path = require('path');

const notificationController = require('../../../controllers/notificationController');
const { protect } = require('../../../middleware/authMiddleware');

router.get('/', protect, notificationController.getUserNotifications);
router.put('/:id/read', protect, notificationController.markNotificationRead);
router.put('/read-all', protect, notificationController.markAllNotificationsRead);
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router;
