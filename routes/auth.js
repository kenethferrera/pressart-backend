const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/google
// @desc    Authenticate user with Google OAuth token
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { googleToken, userData } = req.body;

    if (!googleToken || !userData) {
      return res.status(400).json({
        success: false,
        message: 'Google token and user data are required'
      });
    }

    const { sub: googleId, email, name, given_name, family_name, picture, email_verified } = userData;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data from Google'
      });
    }

    // Find or create user
    let user = await User.findOne({ googleId });
    
    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // Update existing user with Google ID
        user = await User.findByIdAndUpdate(
          existingUser._id,
          {
            googleId,
            name,
            given_name,
            family_name,
            picture,
            email_verified,
            lastLogin: new Date()
          },
          { new: true }
        );
      } else {
        // Create new user
        user = new User({
          googleId,
          email,
          name,
          given_name,
          family_name,
          picture,
          email_verified,
          lastLogin: new Date()
        });
        await user.save();
      }
    } else {
      // Update existing user's last login and profile info
      user.lastLogin = new Date();
      user.name = name;
      user.given_name = given_name;
      user.family_name = family_name;
      user.picture = picture;
      user.email_verified = email_verified;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        given_name: user.given_name,
        family_name: user.family_name,
        picture: user.picture,
        email_verified: user.email_verified
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        googleId: req.user.googleId,
        email: req.user.email,
        name: req.user.name,
        given_name: req.user.given_name,
        family_name: req.user.family_name,
        picture: req.user.picture,
        email_verified: req.user.email_verified
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a production app, you might want to maintain a blacklist of tokens
    // For now, we'll just send a success response as the client handles token removal
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private
router.post('/verify-token', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token is valid',
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during token verification'
    });
  }
});

module.exports = router;
