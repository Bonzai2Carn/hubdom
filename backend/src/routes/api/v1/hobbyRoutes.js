// // backend/src/routes/api/v1/hobbyRoutes.ts
// import { Router } from 'express';
// import asyncHandler from 'express-async-handler';
// import { Request, Response } from 'express';
// import { 
//   getAllHobbies, 
//   getHobby, 
//   createHobby, 
//   updateHobby, 
//   deleteHobby,
//   joinHobby,
//   leaveHobby,
//   getPopularHobbies,
//   getNearbyHobbies
// } from '../../../controllers/hobbyControllers';
// import { authenticate } from '../../../middleware/customAuthMiddleware';

// const router = Router();

// // Create wrapper handlers that don't return anything
// const getAllHobbiesHandler = async (req, res) => {
//   await getAllHobbies(req, res);
// };

// const getPopularHobbiesHandler = async (req, res) => {
//   await getPopularHobbies(req, res);
// };

// const getNearbyHobbiesHandler = async (req, res) => {
//   await getNearbyHobbies(req, res);
// };

// const getHobbyHandler = async (req, res) => {
//   await getHobby(req, res);
// };

// const createHobbyHandler = async (req, res) => {
//   await createHobby(req, res);
// };

// const updateHobbyHandler = async (req, res) => {
//   await updateHobby(req, res);
// };

// const deleteHobbyHandler = async (req, res) => {
//   await deleteHobby(req, res);
// };

// const joinHobbyHandler = async (req, res) => {
//   await joinHobby(req, res);
// };

// const leaveHobbyHandler = async (req, res) => {
//   await leaveHobby(req, res);
// };
// // Public routes
// router.get('/', getAllHobbiesHandler);
// router.get('/popular', getPopularHobbiesHandler);
// router.get('/nearby', getNearbyHobbiesHandler);
// router.get('/:id', getHobbyHandler);

// // Protected routes - require authentication
// router.post('/', authenticate, createHobbyHandler);
// router.put('/:id', authenticate, updateHobbyHandler);
// router.delete('/:id', authenticate, deleteHobbyHandler);
// router.post('/:id/join', authenticate, joinHobbyHandler);
// router.post('/:id/leave', authenticate, leaveHobbyHandler);
// router.post('/:id/leave', authenticate, leaveHobbyHandler);

// module.export = router;

// src/routes/api/v1/hobbyRoutes.js
const express = require('express');
const router = express.Router();
const hobbyController = require('../../../controllers/hobbyControllers');
const { authenticate } = require('../../../middleware/customAuthMiddleware');

// Public routes
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