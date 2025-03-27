// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware to protect routes
 * Verifies the JWT token and adds the user to the request
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // Check if token exists in cookies (fallback)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated. Please login to access this resource."
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', {
        algorithms: ['HS256']
      });
      
      // Get user from database
      const user = await User.findById(decoded.id).select("-password");

      // If user not found
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found or token is invalid"
        });
      }

      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      // Token verification failed
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: "Token expired. Please login again.",
          code: "TOKEN_EXPIRED"
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: "Invalid token. Please login again.",
          code: "INVALID_TOKEN"
        });
      }

      return res.status(401).json({
        success: false,
        error: "Authentication failed. Please login again."
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error during authentication"
    });
  }
};

/**
 * Role-based authorization middleware
 * Restricts access to specific user roles
 * 
 * @param {...string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure user exists in request (from protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated. Please login to access this resource."
      });
    }
    
    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User with role '${req.user.role}' is not authorized to access this resource`,
        code: "FORBIDDEN"
      });
    }
    
    next();
  };
};

module.exports = { protect, authorize };