// src/controllers/authControllers.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/User');

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Generate JWT tokens
 */
const generateTokens = (userId) => {
  const token = jwt.sign(
    { id: userId,
      iat: Math.floor(Date.now() / 1000)
     }, 
    process.env.JWT_SECRET || 'fallback_secret', 
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      algorithm: 'HS256' 
    }
  );
  
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  
  return { token, refreshToken };
};

/**
 * Format user object to send to client
 */
const formatUserResponse = (user) => {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    bio: user.bio,
    avatar: user.avatar,
    location: user.location,
    hobbies: user.hobbies?.map((id) => id.toString()),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Validate input
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: "Please provide username, email, password and name",
      });
    }

    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        error: "Username is already taken",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name
    });

    await user.save();

    // Generate JWT tokens
    const { token, refreshToken } = generateTokens(user._id);

    const response = {
      success: true,
      user: formatUserResponse(user),
      tokens: { token, refreshToken }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during registration",
    });
  }
};

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if ((!email && !username) || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email/username and password",
      });
    }

    console.log(`Looking for user with ${email ? 'email: ' + email : 'username: ' + username}`);

    // Find user by email or username
    const user = await User.findOne(email ? { email } : { username });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Generate JWT tokens
    const { token, refreshToken } = generateTokens(user._id);

    const response = {
      success: true,
      user: formatUserResponse(user),
      tokens: { token, refreshToken }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during login",
    });
  }
};

/**
 * Google OAuth authentication
 * @route POST /api/v1/auth/google
 * @access Public
 */
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }

    // Verify token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        error: "Invalid token",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email: payload.email });

    // Create user if not exists
    if (!user) {
      // Generate a unique username based on email or name
      const baseUsername = (payload.name || payload.email?.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      
      let username = baseUsername;
      let counter = 1;
      
      // Check if username already exists and append counter if needed
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = new User({
        username,
        email: payload.email,
        name: payload.name || username,
        googleId: payload.sub,
        avatar: payload.picture,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
      });

      await user.save();
    } else if (!user.googleId) {
      // Link account if user exists but googleId not set
      user.googleId = payload.sub;
      user.avatar = user.avatar || payload.picture;
      await user.save();
    }

    // Generate JWT tokens
    const { token: authToken, refreshToken } = generateTokens(user._id);

    const response = {
      success: true,
      user: formatUserResponse(user),
      tokens: { token: authToken, refreshToken }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during Google authentication",
    });
  }
};

/**
 * Facebook OAuth authentication
 * @route POST /api/v1/auth/facebook
 * @access Public
 */
const facebookAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }

    // Verify token with Facebook
    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
    );

    const { id, name, email, picture } = response.data;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required from Facebook",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      // Generate a unique username based on email or name
      const baseUsername = (name || email.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      
      let username = baseUsername;
      let counter = 1;
      
      // Check if username already exists and append counter if needed
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = new User({
        username,
        email,
        name: name || username,
        facebookId: id,
        avatar: picture?.data?.url,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
      });

      await user.save();
    } else if (!user.facebookId) {
      // Link account if user exists but facebookId not set
      user.facebookId = id;
      user.avatar = user.avatar || picture?.data?.url;
      await user.save();
    }

    // Generate JWT tokens
    const { token: authToken, refreshToken } = generateTokens(user._id);

    const authResponse = {
      success: true,
      user: formatUserResponse(user),
      tokens: { token: authToken, refreshToken }
    };

    res.status(200).json(authResponse);
  } catch (error) {
    console.error("Facebook auth error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during Facebook authentication",
    });
  }
};

/**
 * Twitter (X) OAuth authentication
 * @route POST /api/v1/auth/twitter
 * @access Public
 */
const twitterAuth = async (req, res) => {
  try {
    const { token, email, name } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        error: "Token and email are required",
      });
    }

    // For Twitter, we're assuming the client-side has already verified the token
    // and provided the necessary user info, as Twitter's v2 OAuth requires server-side secrets
    // that we can't expose in client code
    
    // Extract Twitter user ID from token (this would need to be adapted to your token format)
    const twitterId = token.split('|')[0]; // Example, adjust based on your token structure

    // Check if user exists
    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      // Generate a unique username based on email or name
      const baseUsername = (name || email.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      
      let username = baseUsername;
      let counter = 1;
      
      // Check if username already exists and append counter if needed
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = new User({
        username,
        email,
        name: name || username,
        twitterId,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
      });

      await user.save();
    } else if (!user.twitterId) {
      // Link account if user exists but twitterId not set
      user.twitterId = twitterId;
      await user.save();
    }

    // Generate JWT tokens
    const { token: authToken, refreshToken } = generateTokens(user._id);

    const response = {
      success: true,
      user: formatUserResponse(user),
      tokens: { token: authToken, refreshToken }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Twitter auth error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during Twitter authentication",
    });
  }
};

/**
 * Social authentication (general handler)
 * @route POST /api/v1/auth/social
 * @access Public
 */
const socialAuth = async (req, res) => {
  try {
    const { provider, token, email, name } = req.body;

    if (!provider || !token) {
      return res.status(400).json({
        success: false,
        error: "Provider and token are required",
      });
    }

    switch (provider) {
      case 'google':
        return googleAuth(req, res);
      case 'facebook':
        return facebookAuth(req, res);
      case 'twitter':
        return twitterAuth(req, res);
      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported provider: ${provider}`,
        });
    }
  } catch (error) {
    console.error("Social auth error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during social authentication",
    });
  }
};

/**
 * Refresh token
 * @route POST /api/v1/auth/refresh-token
 * @access Public
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: refreshTokenValue } = req.body;

    if (!refreshTokenValue) {
      return res.status(400).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    try {
      // Verify token with explicit algorithm
      const decoded = jwt.verify(
        token, 
        process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
        { algorithms: ['HS256'] }
      );
      
      // Generate new tokens
      const { token, refreshToken: newRefreshToken } = generateTokens(decoded.id);

      res.status(200).json({
        success: true,
        tokens: { token, refreshToken: newRefreshToken },
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired refresh token",
      });
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during token refresh",
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/v1/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: formatUserResponse(user),
        tokens: {token, refreshToken}
      },
      message: "Login successful"
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching user data",
    });
  }
};
/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Public
 */
const logout = async (req, res) => {
  try {
    // In a more comprehensive implementation, you would blacklist the token
    // or remove it from a tokens table in the database
    
    res.status(200).json({
      success: true,
      data: null,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Server error during logout",
    });
  }
};

// Make sure to include logout in the exports
module.exports = {
  register,
  login,
  socialAuth,
  refreshToken,
  logout,
  getMe,  // Add this line to your exports
};