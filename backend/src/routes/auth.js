const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin, validateRegister } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.use(protect); // Apply authentication middleware to all routes below

router.get('/me', authController.getCurrentUser);
router.post('/logout', authController.logout);
router.put('/profile', authController.updateProfile);
router.put('/change-password', authController.changePassword);
router.put('/deactivate', authController.deactivateAccount);

module.exports = router; 