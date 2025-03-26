// src/routes/api/v1/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../../../controllers/eventController');
const { protect } = require('../../../middleware/authMiddleware');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.get('/user/:userId', eventController.getUserEvents);
router.get('/nearby', eventController.getNearbyEvents);

// Protected routes - require authentication
router.post('/', protect, eventController.createEvent);
router.put('/:id', protect, eventController.updateEvent);
router.delete('/:id', protect, eventController.deleteEvent);
router.post('/:id/join', protect, eventController.joinEvent);
router.post('/:id/leave', protect, eventController.leaveEvent);

module.exports = router;