// src/controllers/userController.js
const User = require("../models/User");

// Update user's current location
const updateUserLocation = async (req, res) => {
  try {
    const { longitude, latitude, timestamp } = req.body;
    const userId = req.user.id;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        error: "Longitude and latitude are required",
      });
    }

    await User.findByIdAndUpdate(userId, {
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      lastLocationUpdate: timestamp || new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update location",
    });
  }
};

// Update user's location sharing settings
const updateLocationSettings = async (req, res) => {
  try {
    const { isLocationSharingEnabled, geofenceRadius } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      locationSharingEnabled: isLocationSharingEnabled,
      geofenceRadius: geofenceRadius || 5000, // Default 5km if not specified
    });

    res.status(200).json({
      success: true,
      message: "Location settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating location settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update location settings",
    });
  }
};

module.exports = {
  updateUserLocation,
  updateLocationSettings,
  // Add other user-related controllers here
};