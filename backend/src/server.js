// src/server.js
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Define allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:19006",
    "http://localhost:19000",
      "http://localhost:8081", // Add this line
      "exp://127.0.0.1:19000",
  ];

// Increase the JSON body size limit
app.use(bodyParser.json({ limit: "50mb" }));
// Increase the URL-encoded payload size limit
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// app.use(
//   cors({
//     origin: allowedOrigins,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/hobbyhubdb";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Database connected to:", MONGODB_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Import routes - FIX: Use the correct path
const apiV1Routes = require("./routes/api/v1"); //add /index

// Mount API routes - FIX: Use just /api/v1 instead of /api/v1/index
app.use("/api/v1", apiV1Routes);

// 404 handler
app.use((req, res) => {
  res.status(404).send({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).send({
    error: {
      message: err.message || "Something went wrong!",
      status: err.status || 500,
    },
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // for testing