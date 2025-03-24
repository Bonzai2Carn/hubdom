// src/controllers/chatControllers.js
const Message = require("../models/Message");

// Get messages for an event
const getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;

    const messages = await Message.find({ eventId })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar");

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send a message
const sendEventMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { content } = req.body;

    const message = new Message({
      sender: req.user.id,
      content,
      eventId,
    });

    await message.save();

    // Populate sender info
    await message.populate("sender", "name avatar");

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getEventMessages,
  sendEventMessage
};