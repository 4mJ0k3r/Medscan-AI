const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse 
} = require('../utils/responseUtils');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    successResponse(res, {
      user: user.toJSON(),
      token
    }, 'User registered successfully', 201);
  } catch (error) {
    console.error('Registration error:', error);
    errorResponse(res, 'Registration failed', 500);
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return unauthorizedResponse(res, 'Invalid credentials');
    }

    // Check if account is active
    if (!user.isActive) {
      return unauthorizedResponse(res, 'Account is deactivated');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return unauthorizedResponse(res, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    successResponse(res, {
      user: user.toJSON(),
      token
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 'Login failed', 500);
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    successResponse(res, user.toJSON(), 'User retrieved successfully');
  } catch (error) {
    console.error('Get current user error:', error);
    errorResponse(res, 'Failed to get user', 500);
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled on the client side
    // But we can add token blacklisting here if needed
    
    successResponse(res, null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    errorResponse(res, 'Logout failed', 500);
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
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
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    successResponse(res, user.toJSON(), 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    errorResponse(res, 'Failed to update profile', 500);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return unauthorizedResponse(res, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    errorResponse(res, 'Failed to change password', 500);
  }
};

// Deactivate account
const deactivateAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { isActive: false });

    successResponse(res, null, 'Account deactivated successfully');
  } catch (error) {
    console.error('Deactivate account error:', error);
    errorResponse(res, 'Failed to deactivate account', 500);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  updateProfile,
  changePassword,
  deactivateAccount
}; 