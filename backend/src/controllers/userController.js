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

/**
 * Update user profile
 * @route PUT /api/v1/users/profile
 * @access Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      displayName,
      avatarType,
      bio,
      notificationPreferences,
      hobbies
    } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Update fields if provided
    if (displayName) user.displayName = displayName;
    if (avatarType) {
      // Validate avatar type
      const validAvatarTypes = [
        'Competitor', 'Visionary', 'Maestro', 'Strategist', 'Connector', 
        'Gourmet', 'Chef', 'Explorer', 'Scholar', 'Maker', 'Curator', 
        'Sage', 'Tinkerer', 'Animal Advocate', 'Wanderer', 'Digital Nomad'
      ];
      
      if (!validAvatarTypes.includes(avatarType)) {
        return res.status(400).json({
          success: false,
          error: "Invalid avatar type"
        });
      }
      
      user.avatarType = avatarType;
    }
    
    if (bio) user.bio = bio;
    
    // Update notification preferences
    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences
      };
    }
    
    // Update hobbies if provided (as array of hobby IDs)
    if (hobbies && Array.isArray(hobbies)) {
      // Validate each hobby ID exists
      const validHobbies = [];
      for (const hobbyId of hobbies) {
        const hobby = await Hobby.findById(hobbyId);
        if (hobby) {
          validHobbies.push(hobbyId);
        }
      }
      
      // Use $addToSet to prevent duplicates
      if (validHobbies.length > 0) {
        // Replace existing hobbies with new ones
        user.hobbies = validHobbies;
      }
    }
    
    // Save updated user
    await user.save();
    
    // Format response
    const formattedUser = formatUserResponse(user);
    
    res.status(200).json({
      success: true,
      user: formattedUser
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating profile"
    });
  }
};

/**
 * Update user avatar type
 * @route PUT /api/v1/users/avatar
 * @access Private
 */
const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatarType } = req.body;

    if (!avatarType) {
      return res.status(400).json({
        success: false,
        error: "Avatar type is required"
      });
    }

    // Validate avatar type
    const validAvatarTypes = [
      'Competitor', 'Visionary', 'Maestro', 'Strategist', 'Connector', 
      'Gourmet', 'Chef', 'Explorer', 'Scholar', 'Maker', 'Curator', 
      'Sage', 'Tinkerer', 'Animal Advocate', 'Wanderer', 'Digital Nomad'
    ];
    
    if (!validAvatarTypes.includes(avatarType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid avatar type"
      });
    }

    // Update avatar type
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarType },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Format response
    const formattedUser = formatUserResponse(updatedUser);
    
    res.status(200).json({
      success: true,
      user: formattedUser
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating avatar"
    });
  }
};

// Update module.exports
module.exports = {
  updateUserLocation,
  updateLocationSettings,
  updateUserProfile,
  updateUserAvatar,
  // Other existing exports
};