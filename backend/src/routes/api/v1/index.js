// src/routes/api/v1/index.js
const express = require("express");
const router = express.Router();

// Import route files
const authRoutes = require("./authRoutes");
const hobbyRoutes = require("./hobbyRoutes");
const eventRoutes = require("./eventRoutes");
const userRoutes = require("./userRoutes");
const dataController = require("../../../controllers/dataController");

// API welcome route
router.get("/", (req, res) => {
  res.json({
    name: 'HobbyHub API',
    description: 'API for HobbyHub application',
    versions: ['v1'],
    message: "Welcome to HobbyHub API v1",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes with correct references
router.use("/auth", authRoutes);
router.use("/hobbies", hobbyRoutes);
router.use("/events", eventRoutes);
router.use("/users", userRoutes);

// Log routing for debugging
console.log('Routes mounted successfully:');
console.log('- /auth routes mounted');
console.log('- /hobbies routes mounted');
console.log('- /events routes mounted');
console.log('- /users routes mounted');

// Data routes
router.get("/data", dataController.getData);
router.post("/data", dataController.addData);
router.put("/data/:id", dataController.updateData);
router.delete("/data/:id", dataController.deleteData);

// Version deprecation middleware
const deprecationCheck = (req, res, next) => {
  // Check for deprecated API versions
  if (req.baseUrl === '/api/v1' && process.env.DEPRECATE_V1 === 'true') {
    res.set('Warning', '299 - "This API version is deprecated. Please upgrade to the latest version."');
  }
  next();
};

// Apply middleware
router.use(deprecationCheck);

module.exports = router;