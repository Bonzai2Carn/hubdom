// src/controllers/hobbyControllers.js
const Hobby = require('../models/Hobby');
const User = require('../models/User');

/**
 * Get all hobbies
 * @route GET /api/v1/hobbies
 * @access Public
 */
const getAllHobbies = async (req, res) => {
  try {
    const hobbies = await Hobby.find();

    const response = {
      success: true,
      data: hobbies,
      count: hobbies.length
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching hobbies:", error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

/**
 * Get a single hobby
 * @route GET /api/v1/hobbies/:id
 * @access Public
 */
const getHobby = async (req, res) => {
  try {
    const { id } = req.params;
    const hobby = await Hobby.findById(id);

    if (!hobby) {
      return res.status(404).json({
        success: false,
        error: "Hobby not found"
      });
    }

    const response = {
      success: true,
      data: hobby
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching hobby:", error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

/**
 * Create a new hobby
 * @route POST /api/v1/hobbies
 * @access Private
 */
const createHobby = async (req, res) => {
  try {
    const { name, description, category, tags, image } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: "Please provide name and description"
      });
    }

    const hobby = await Hobby.create({ 
      name, 
      description, 
      category, 
      tags, 
      image,
      creator: req.user.id
    });

    const response = {
      success: true,
      data: hobby
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating hobby:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "A hobby with this name already exists"
      });
    }

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

/**
 * Update a hobby
 * @route PUT /api/v1/hobbies/:id
 * @access Private
 */
const updateHobby = async (req, res) => {
  try {
    const { id } = req.params;
    let hobby = await Hobby.findById(id);

    if (!hobby) {
      return res.status(404).json({
        success: false,
        error: "Hobby not found"
      });
    }

    if (hobby.creator && hobby.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this hobby"
      });
    }

    hobby = await Hobby.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    const response = {
      success: true,
      data: hobby
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating hobby:", error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

/**
 * Delete a hobby
 * @route DELETE /api/v1/hobbies/:id
 * @access Private
 */
const deleteHobby = async (req, res) => {
  try {
    const { id } = req.params;
    const hobby = await Hobby.findById(id);

    if (!hobby) {
      return res.status(404).json({
        success: false,
        error: "Hobby not found"
      });
    }

    if (hobby.creator && hobby.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this hobby"
      });
    }

    await hobby.deleteOne();

    const response = {
      success: true,
      data: {}
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting hobby:", error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

/**
 * Join a hobby (add to user's hobbies)
 * @route POST /api/v1/hobbies/:id/join
 * @access Private
 */
const joinHobby = async (req, res) => {
  try {
    const { id } = req.params;
    const hobby = await Hobby.findById(id);

    if (!hobby) {
      return res.status(404).json({
        success: false,
        error: "Hobby not found"
      });
    }

    const user = req.user;

    if (user.hobbies && user.hobbies.includes(id)) {
      return res.status(400).json({
        success: false,
        error: "User already joined this hobby"
      });
    }

    user.hobbies = user.hobbies || [];
    user.hobbies.push(id);
    await user.save();

    hobby.popularity = (hobby.popularity || 0) + 1;
    await hobby.save();

    const response = {
      success: true,
      data: hobby
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error joining hobby:", error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

/**
 * Leave a hobby (remove from user's hobbies)
 * @route POST /api/v1/hobbies/:id/leave
 * @access Private
 */
const leaveHobby = async (req, res) => {
  try {
    const { id } = req.params;
    const hobby = await Hobby.findById(id);

    if (!hobby) {
      return res.status(404).json({
        success: false,
        error: "Hobby not found"
      });
    }

    const user = req.user;

    if (!user.hobbies || !user.hobbies.includes(id)) {
      return res.status(400).json({
        success: false,
        error: "User hasn't joined this hobby"
      });
    }

    user.hobbies = user.hobbies.filter((hobbyId) => hobbyId.toString() !== id);
    await user.save();

    if ((hobby.popularity || 0) > 0) {
      hobby.popularity = (hobby.popularity || 0) - 1;
      await hobby.save();
    }

    const response = {
      success: true,
      data: hobby
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error leaving hobby:", error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

/**
 * Get popular hobbies
 * @route GET /api/v1/hobbies/popular
 * @access Public
 */
const getPopularHobbies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const hobbies = await Hobby.find()
      .sort({ popularity: -1 })
      .limit(limit);

    const response = {
      success: true,
      data: hobbies,
      count: hobbies.length
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching popular hobbies:", error);

    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

/**
 * Get nearby hobbies (based on user location and hobby events)
 * @route GET /api/v1/hobbies/nearby
 * @access Public
 */
const getNearbyHobbies = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: "Please provide latitude and longitude"
      });
    }

    // For simplicity, just return a few hobbies for now
    const hobbies = await Hobby.find().limit(5);

    const response = {
      success: true,
      data: hobbies,
      count: hobbies.length
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching nearby hobbies:", error);
    
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

module.exports = {
  getAllHobbies,
  getHobby,
  createHobby,
  updateHobby,
  deleteHobby,
  joinHobby,
  leaveHobby,
  getPopularHobbies,
  getNearbyHobbies
};