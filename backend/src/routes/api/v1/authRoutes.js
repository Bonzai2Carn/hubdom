// src/routes/api/v1/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/authControllers');
const { protect } = require('../../../middleware/authMiddleware');
const { authLimiter } = require('../../../middleware/rateLimiter');

// Check each controller function is defined
console.log('Available auth controllers:', Object.keys(authController));


// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/social', authController.socialAuth);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout); // Add logout endpoint

// Protected routes
router.get('/me', /*protect,*/ authController.getMe);

//rate Limiter
router.post('/login', authLimiter, authController.login);
router.post('/register', authLimiter, authController.register);

module.exports = router;