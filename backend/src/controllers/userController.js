const User = require('../models/User');
const { 
  successResponse, 
  errorResponse, 
  notFoundResponse 
} = require('../utils/responseUtils');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return notFoundResponse(res, 'User not found');
    }

    successResponse(res, user.toJSON(), 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    errorResponse(res, 'Failed to retrieve profile', 500);
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const userId = req.user._id;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return errorResponse(res, 'Email already taken', 400);
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return notFoundResponse(res, 'User not found');
    }

    successResponse(res, user.toJSON(), 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    errorResponse(res, 'Failed to update profile', 500);
  }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const userId = req.user._id;
    const avatarUrl = `/uploads/${req.file.filename}`;

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return notFoundResponse(res, 'User not found');
    }

    successResponse(res, {
      avatar: avatarUrl,
      user: user.toJSON()
    }, 'Avatar uploaded successfully');
  } catch (error) {
    console.error('Upload avatar error:', error);
    errorResponse(res, 'Failed to upload avatar', 500);
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // This could be expanded to include more user-specific statistics
    const user = await User.findById(userId);
    
    if (!user) {
      return notFoundResponse(res, 'User not found');
    }

    const stats = {
      memberSince: user.createdAt,
      lastLogin: user.lastLogin,
      profileCompletion: calculateProfileCompletion(user)
    };

    successResponse(res, stats, 'User statistics retrieved successfully');
  } catch (error) {
    console.error('Get user stats error:', error);
    errorResponse(res, 'Failed to retrieve user statistics', 500);
  }
};

// Helper function to calculate profile completion
const calculateProfileCompletion = (user) => {
  let completion = 0;
  const fields = ['name', 'email', 'avatar'];
  
  fields.forEach(field => {
    if (user[field] && user[field].trim() !== '') {
      completion += 100 / fields.length;
    }
  });

  return Math.round(completion);
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  getUserStats
}; 