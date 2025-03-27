// src/server.js
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { logger, requestLogger } = require('./middleware/logger');

const app = express();

// Define allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:19006",
      "http://localhost:19000",
      "http://localhost:8081",
      "exp://127.0.0.1:19000",
      "exp://192.168.1.2:19000"
    ];

// Use Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

// Apply logger middleware first
app.use(requestLogger);

// Parse cookies
app.use(cookieParser());

// Configure body parser with increased limits
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`Origin ${origin} not allowed by CORS`);
        return callback(null, true); // Allow all origins in development for easier testing
        // In production, use: return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/hobbyhubdb";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { 
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database connected to:", MONGODB_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectDB, 5000);
  }
};

// Connect to MongoDB
connectDB();

// Import routes
const apiV1Routes = require("./routes/api/v1");

// Mount API routes
app.use("/api/v1", apiV1Routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: `Route not found: ${req.originalUrl}` 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || "Something went wrong!",
      status: err.status || 500,
    },
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, server }; // Export for testing