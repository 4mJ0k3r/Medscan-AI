const express = require('express');
const router = express.Router();
const bloodTestController = require('../controllers/bloodTestController');
const { protect } = require('../middleware/auth');
const { validateBloodTestUpload } = require('../middleware/validation');
const upload = require('../config/multer');

// Apply authentication middleware to all routes
router.use(protect);

// Blood test routes
router.post('/upload', 
  upload.single('bloodTestFile'), 
  validateBloodTestUpload, 
  bloodTestController.uploadBloodTest
);

router.get('/reports', bloodTestController.getBloodTests);
router.get('/reports/:id', bloodTestController.getBloodTest);
router.put('/reports/:id', bloodTestController.updateBloodTest);
router.delete('/reports/:id', bloodTestController.deleteBloodTest);

// Analysis routes
router.get('/reports/:id/analysis', bloodTestController.getAnalysis);
router.post('/reports/:id/reprocess', bloodTestController.reprocessBloodTest);
router.get('/reports/:id/status', bloodTestController.getProcessingStatus);

// Dashboard route
router.get('/dashboard', bloodTestController.getDashboardStats);

module.exports = router; 