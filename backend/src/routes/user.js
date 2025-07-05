const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');
const upload = require('../config/multer');

// Apply authentication middleware to all routes
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateProfileUpdate, userController.updateProfile);
router.get('/stats', userController.getUserStats);

// Avatar upload route
router.post('/avatar', 
  upload.single('avatar'), 
  userController.uploadAvatar
);

module.exports = router; 