// src/routes/api/v1/hobbyRoutes.js
const express = require('express');
const router = express.Router();
const hobbyController = require('../../../controllers/hobbyControllers');
const { protect } = require('../../../middleware/authMiddleware');

// Public routes
router.get("/category/:category", hobbyController.getHobbiesByCategory);
router.get('/', hobbyController.getAllHobbies);
router.get('/popular', hobbyController.getPopularHobbies);
router.get('/nearby', hobbyController.getNearbyHobbies);
router.get('/:id', hobbyController.getHobby);

// Protected routes - require authentication
router.post('/publish', protect, hobbyController.publishHobby);
router.put('/:id', protect, hobbyController.updateHobby);
router.delete('/:id', protect, hobbyController.deleteHobby);
router.post('/:id/join', protect, hobbyController.joinHobby);
router.post('/:id/leave', protect, hobbyController.leaveHobby);

module.exports = router;