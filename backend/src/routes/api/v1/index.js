const express = require("express");
const router = express.Router();

// Import route files - use require consistently
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

// Mount routes -- currently hobbies and events work perfectly except auth and users
router.use("/auth", authRoutes);
router.use("/hobbies", hobbyRoutes);
router.use("/events", eventRoutes);
router.use("/users", userRoutes);

console.log('Mounting routes...');
console.log('/auth', authRoutes);
console.log('/hobbies', userRoutes);
console.log('events', hobbyRoutes);
console.log('users', eventRoutes);


// Data routes
router.get("/data", dataController.getData);
router.post("/data", dataController.addData);
router.put("/data/:id", dataController.updateData);
router.delete("/data/:id", dataController.deleteData);

//Version deprecation middleware
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