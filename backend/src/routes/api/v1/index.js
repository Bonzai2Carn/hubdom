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
    message: "Welcome to HobbyHub API v1",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use("/auth", authRoutes);
router.use("/hobbies", hobbyRoutes);
router.use("/events", eventRoutes);
router.use("/users", userRoutes);

// Data routes
router.get("/data", dataController.getData);
router.post("/data", dataController.addData);
router.put("/data/:id", dataController.updateData);
router.delete("/data/:id", dataController.deleteData);

module.exports = router;