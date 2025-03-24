// // backend/src/routes/api/v1/userRoutes.ts
// import express from 'express';
// import { Request, Response } from 'express';
// import userController from '../../../controllers/userController';
// import { authenticate } from '../../../middleware/customAuthMiddleware';

// const router = express.Router();

// // Create wrapper functions
// const updateUserLocationHandler = async (req, res) => {
//   await userController.updateUserLocation(req, res);
// };

// const updateLocationSettingsHandler = async (req, res) => {
//   await userController.updateLocationSettings(req, res);
// };

// router.post("/location", authenticate, updateUserLocationHandler);
// router.post(
//   "/location/settings",
//   authenticate,
//   updateLocationSettingsHandler
// );

// module.export = router;

// src/routes/api/v1/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/userController');
const { protect } = require('../../../middleware/authMiddleware');

router.post("/location", protect, userController.updateUserLocation);
router.post("/location/settings", protect, userController.updateLocationSettings);

module.exports = router;