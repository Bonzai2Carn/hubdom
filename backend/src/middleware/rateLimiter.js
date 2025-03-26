// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Create rate limiter for auth routes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true, // Send standard rate limit headers
  legacyHeaders: false, // Disable legacy X-RateLimit headers
  message: {
    success: false,
    error: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  }
});

// Apply to auth routes:
// router.post('/login', authLimiter, authController.login);
// router.post('/register', authLimiter, authController.register);