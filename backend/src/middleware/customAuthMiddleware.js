const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated. Please login to access this resource."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Add user from payload/database to request object
    const user = await User.findById(decoded.id);

    // If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found or token is invalid",
      });
    }

    req.user = user;
    next();
  } catch (error) {

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: "Token expired. Please login again.",
          code: "TOKEN_EXPIRED"
        });
      }
      
      return res.status(401).json({
        success: false,
        error: "Authentication failed. Please login again."
      });
    }
  };

exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    
    next();
  };
};
