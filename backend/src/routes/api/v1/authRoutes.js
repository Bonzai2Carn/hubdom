// src/routes/api/v1/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/authControllers');
const { protect } = require('../../../middleware/authMiddleware');
const { authLimiter } = require('../../../middleware/rateLimiter');

// Public routes with rate limiting applied
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/social', authController.socialAuth);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', protect, authController.getMe);

module.exports = router;