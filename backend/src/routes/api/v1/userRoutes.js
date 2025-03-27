// src/routes/api/v1/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/userController');
const { protect } = require('../../../middleware/authMiddleware');

// Apply protect middleware to all user routes
router.post("/location", protect, userController.updateUserLocation);
router.post("/location/settings", protect, userController.updateLocationSettings);

// Export the router
module.exports = router;