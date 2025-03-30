// src/routes/api/v1/hobbyRoutes.js
const express = require('express');
const router = express.Router();
const hobbyController = require('../../../controllers/hobbyControllers');
const { authenticate } = require('../../../middleware/customAuthMiddleware');

// Public routes
router.get("/category/:category", hobbyController.getHobbiesByCategory);
router.post("/publish", protect, hobbyController.publishHobby);
router.get('/', hobbyController.getAllHobbies);
router.get('/popular', hobbyController.getPopularHobbies);
router.get('/nearby', hobbyController.getNearbyHobbies);
router.get('/:id', hobbyController.getHobby);

// Protected routes - require authentication
router.post('/', authenticate, hobbyController.createHobby);
router.put('/:id', authenticate, hobbyController.updateHobby);
router.delete('/:id', authenticate, hobbyController.deleteHobby);
router.post('/:id/join', authenticate, hobbyController.joinHobby);
router.post('/:id/leave', authenticate, hobbyController.leaveHobby);

module.exports = router;