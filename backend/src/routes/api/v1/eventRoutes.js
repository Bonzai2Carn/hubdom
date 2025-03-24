// // src/routes/api/v1/eventRoutes.js
// import express from 'express';
// const router = express.Router();
// const eventController = require("../../../controllers/eventController");
// const authMiddleware = require("../../../middleware/authMiddleware");
// import { Event as EventModel } from '../../../models/Event';

// // Public routes
// router.get("/", eventController.getAllEvents);
// router.get("/:id", eventController.getEvent);
// router.get("/user/:userId", eventController.getUserEvents);
// router.get("/nearby", eventController.getNearbyEvents);

// const getNearbyEvents = async (req, res) => {
//   try {
//     const { longitude, latitude, radius, hobbyType } = req.query;

//     // Convert radius from meters to kilometers for MongoDB
//     const radiusInKm = parseFloat(radius) / 1000;

//     // Build query
//     // Build query
// const query: any = {
//   location: {
//     $nearSphere: {
//       $geometry: {
//         type: "Point",
//         coordinates: [parseFloat(longitude), parseFloat(latitude)],
//       },
//       $maxDistance: radiusInKm * 1000, // Convert back to meters for MongoDB
//     },
//   },
// };

// // Add hobby type filter if provided
// if (hobbyType) {
//   query.hobbyType = hobbyType;
// }

// const events = await EventModel.find(query)
//       .populate("organizer", "name")
//       .populate("hobby", "name color")
//       .sort({ startDate: 1 });

//     res.status(200).json({
//       success: true,
//       count: events.length,
//       data: events,
//     });
//   } catch (error) {
//     console.error("Error fetching nearby events:", error);
//     res.status(500).json({ error: "Failed to fetch nearby events" });
//   }
// };

// // Protected routes - require authentication
// router.post("/", authMiddleware, eventController.createEvent);
// router.put("/:id", authMiddleware, eventController.updateEvent);
// router.delete("/:id", authMiddleware, eventController.deleteEvent);
// router.post("/:id/join", authMiddleware, eventController.joinEvent);
// router.post("/:id/leave", authMiddleware, eventController.leaveEvent);

// export default router;

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