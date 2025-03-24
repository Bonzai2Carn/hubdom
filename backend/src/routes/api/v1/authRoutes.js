// const express = require('express');
// const authController = require ('../../../controllers/authControllers');

// const authMiddleware = require ('../../../middleware/authMiddleware');

// const router = express.Router();

// const registerHandler = async (req, res) => {
//   await register(req, res);
// };

// const loginHandler = async (req, res) => {
//   await login(req, res);
// };

// const socialAuthHandler = async (req, res) => {
//   await socialAuth(req, res);
// };

// const refreshTokenHandler = async (req, res) => {
//   await refreshToken(req, res);
// };

// const getMeHandler = async (req, res) => {
//   await getMe(req, res);
// };

// // Public routes
// router.post('/register', registerHandler);
// router.post('/login', loginHandler);
// router.post('/social', socialAuthHandler);
// router.post('/refresh-token', refreshTokenHandler);

// // Protected routes
// router.get('/me', authMiddleware, getMeHandler);

// export default router;

// src/routes/api/v1/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/authControllers');
const { protect } = require('../../../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/social', authController.socialAuth);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/me', protect, authController.getMe);

module.exports = router;