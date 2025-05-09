// src/controllers/eventController.js
const Event = require('../models/Event');
const Hobby = require('../models/Hobby');

/**
 * Get all events
 * @route GET /api/v1/events
 * @access Public
 */
async function getAllEvents(req, res) {
  try {
    // Mock data for now
    const events = [
      {
        id: 1,
        title: "Photography Workshop",
        description: "Learn the basics of photography",
        startDate: "2025-03-15T14:00:00Z",
        endDate: "2025-03-15T17:00:00Z",
        hobby: { id: 1, name: "Photography" },
        location: {
          formattedAddress: "123 Main St, New York, NY",
          coordinates: [40.712776, -74.005974],
        },
      },
      {
        id: 2,
        title: "Garden Club Meeting",
        description: "Monthly meeting of garden enthusiasts",
        startDate: "2025-03-20T18:30:00Z",
        endDate: "2025-03-20T20:00:00Z",
        hobby: { id: 2, name: "Gardening" },
        location: {
          formattedAddress: "456 Park Ave, Boston, MA",
          coordinates: [42.360082, -71.05888],
        },
      },
    ];

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

/**
 * Get a single event
 * @route GET /api/v1/events/:id
 * @access Public
 */
async function getEvent(req, res) {
  try {
    const { id } = req.params;

    // Mock data for now
    const event = {
      id: parseInt(id),
      title: "Photography Workshop",
      description: "Learn the basics of photography",
      startDate: "2025-03-15T14:00:00Z",
      endDate: "2025-03-15T17:00:00Z",
      hobby: { id: 1, name: "Photography" },
      location: {
        formattedAddress: "123 Main St, New York, NY",
        coordinates: [40.712776, -74.005974],
      },
      participants: [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
      ],
    };

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

/**
 * Get events for a specific user
 * @route GET /api/v1/events/user/:userId
 * @access Public
 */
async function getUserEvents(req, res) {
  try {
    const { userId } = req.params;

    // Mock data for now
    const events = [
      {
        id: 1,
        title: "Photography Workshop",
        description: "Learn the basics of photography",
        startDate: "2025-03-15T14:00:00Z",
        endDate: "2025-03-15T17:00:00Z",
      },
    ];

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

/**
 * Create a new event
 * @route POST /api/v1/events
 * @access Private
 */
async function createEvent(req, res) {
  try {
    const {
      title,
      description,
      hobbyId,
      eventType,
      location,
      startDate,
      endDate,
      capacity,
      weeklySchedule,
      participantLimit,
      invitedParticipants,
    } = req.body;

    if (
      !title ||
      !description ||
      !hobbyId ||
      !location ||
      !participantLimit ||
      !eventType ||
      !weeklySchedule ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields",
      });
    }

    // Check if hobby exists
    const hobby = await Hobby.findById(hobbyId);
    if (!hobby) {
      return res.status(404).json({
        success: false,
        error: "Hobby not found"
      });
    }

    // Mock creation response
    // const event = new Event({
    //   id: Date.now(),
    //   title,
    //   description,
    //   hobby: hobbyId,
    //   location: {
    //     type: "Point",
    //     coordinates: [location.longitude, location.latitude],
    //     formattedAddress: location.formattedAddress,
    //   },
    //   startDate,
    //   endDate,
    //   capacity: capacity || 10,
    //   eventType: eventType || "Public",
    //   participantLimit: participantLimit || capacity || 10,
    //   organizer: {
    //     id: req.user.id,
    //     name: req.user.name,
    //   },
    //   participants: [
    //     {
    //       id: req.user.id,
    //       name: req.user.name,
    //     },
    //   ],
    //   createdAt: new Date().toISOString(),
    // });

    // // Add invited participants if provided
    // if (invitedParticipants && Array.isArray(invitedParticipants) && invitedParticipants.length > 0) {
    //   // Validate that each participant exists
    //   const validParticipants = [];
    //   for (const participantId of invitedParticipants) {
    //     const participant = await User.findById(participantId);
    //     if (participant) {
    //       validParticipants.push(participantId);
    //     }
    //   }
    //   event.invitedParticipants = validParticipants;
    // }

    // await event.save();

    // Create event
    const newEvent = await Event.create({
      title,
      description,
      hobby: hobbyId,
      eventType: eventType || "public",
      schedule: {
        days,
        time,
        duration
      },
      organizer: req.user.id,
      location: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
        formattedAddress: location.formattedAddress
      },
      capacity: capacity || 10,
      participants: [{ user: req.user.id, status: "going" }]
    });
    
    // Add additional participants if provided
    if (participants && participants.length > 0) {
      // Add participants here
    }
    
    // // Populate references
    // await newEvent.populate([
    //   { path: 'hobby', select: 'name category image' },
    //   { path: 'organizer', select: 'name username avatar avatarType' },
    //   { path: 'participants', select: 'name username avatar avatarType' },
    // ]);
    
    // Update hobby event count
    await Hobby.findByIdAndUpdate(hobbyId, {
      $inc: { eventsCount: 1 }
    });
    
    res.status(201).json({
      success: true,
      data: newEvent
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
}

/**
 * Update an event
 * @route PUT /api/v1/events/:id
 * @access Private
 */
async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Mock update response
    const event = {
      id: parseInt(id),
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

/**
 * Delete an event
 * @route DELETE /api/v1/events/:id
 * @access Private
 */
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    res.status(200).json({
      success: true,
      message: `Event with ID ${id} deleted successfully`,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

/**
 * Join an event
 * @route POST /api/v1/events/:id/join
 * @access Private
 */
async function joinEvent(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find event
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Check if event is at capacity
    if (event.participants.length >= event.participantLimit) {
      return res.status(400).json({
        success: false,
        error: "Event has reached its participant limit",
      });
    }

    // Check if user is already a participant
    if (event.participants.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: "You are already a participant in this event",
      });
    }

    // For classified events, check if user is invited
    if (event.eventType === "Classified" && !event.invitedParticipants.includes(userId)) {
      return res.status(403).json({
        success: false,
        error: "This is a classified event. You need an invitation to join.",
      });
    }

    // Add user to participants
    event.participants.push(userId);
    await event.save();

    // Populate references for the response
    await event.populate([
      { path: "hobby", select: "name category image" },
      { path: "organizer", select: "name username avatar avatarType" },
      { path: "participants", select: "name username avatar avatarType" },
    ]);

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

/**
 * Leave an event
 * @route POST /api/v1/events/:id/leave
 * @access Private
 */
async function leaveEvent(req, res) {
  try {
    const { id } = req.params;

    // Mock response
    res.status(200).json({
      success: true,
      message: `Successfully left event with ID ${id}`,
      data: {
        id: parseInt(id),
        left: true,
        leftAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error leaving event:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

/**
 * Get nearby events
 * @route GET /api/v1/events/nearby
 * @access Public
 */
async function getNearbyEvents(req, res) {
  try {
    const { latitude, longitude, radius = 10, hobbyType } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: "Please provide latitude and longitude",
      });
    }

    // Convert string parameters to numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    // For now, return mock data since this is a complex geospatial query
    const nearbyEvents = [
      {
        id: 1,
        title: "Photography Walk",
        description: "Walking tour to practice street photography",
        distance: 2.3, // distance in km
        location: {
          coordinates: [lng + 0.01, lat + 0.01], // slightly offset for demo purposes
          formattedAddress: "Near your location"
        }
      },
      {
        id: 2,
        title: "Urban Sketching",
        description: "Meet up with local artists to sketch city scenes",
        distance: 3.7,
        location: {
          coordinates: [lng - 0.02, lat + 0.015],
          formattedAddress: "Central Park"
        }
      }
    ];

    res.status(200).json({
      success: true,
      count: nearbyEvents.length,
      data: nearbyEvents,
    });
  } catch (error) {
    console.error("Error fetching nearby events:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = {
  getAllEvents,
  getEvent,
  getUserEvents,
  getNearbyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
};