const bloodTestService = require('../services/bloodTestService');
const { 
  successResponse, 
  errorResponse, 
  notFoundResponse,
  paginatedResponse 
} = require('../utils/responseUtils');

// Upload blood test file
const uploadBloodTest = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const { title, testDate, labName, doctorName } = req.body;
    const userId = req.user._id;

    // Generate default title if not provided
    const defaultTitle = title || `Blood Test - ${new Date().toLocaleDateString()}`;

    // Create blood test record
    const bloodTest = await bloodTestService.createBloodTest(
      userId,
      req.file,
      { title: defaultTitle, testDate, labName, doctorName }
    );

    // Get OpenAI API key from request headers
    const openaiApiKey = req.headers['x-openai-api-key'];
    if (!openaiApiKey) {
      return errorResponse(res, 'OpenAI API key is required', 400);
    }

    // Start processing in background
    bloodTestService.processBloodTest(bloodTest._id, {
      age: req.user.age,
      gender: req.user.gender,
      openaiApiKey
    }).catch(error => {
      console.error('Background processing error:', error);
    });

    successResponse(res, {
      bloodTest,
      reportId: bloodTest._id,
      message: 'File uploaded successfully. Processing will begin shortly.'
    }, 'Blood test uploaded successfully', 201);
  } catch (error) {
    console.error('Upload error:', error);
    errorResponse(res, 'Failed to upload blood test', 500);
  }
};

// Get all blood tests for user
const getBloodTests = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder,
      status
    };

    const result = await bloodTestService.getUserBloodTests(userId, options);

    paginatedResponse(
      res,
      result.bloodTests,
      result.currentPage,
      options.limit,
      result.total,
      'Blood tests retrieved successfully'
    );
  } catch (error) {
    console.error('Get blood tests error:', error);
    errorResponse(res, 'Failed to retrieve blood tests', 500);
  }
};

// Get single blood test
const getBloodTest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const bloodTest = await bloodTestService.getBloodTestById(id, userId);

    successResponse(res, bloodTest, 'Blood test retrieved successfully');
  } catch (error) {
    console.error('Get blood test error:', error);
    
    if (error.message === 'Blood test not found') {
      return notFoundResponse(res, 'Blood test not found');
    }
    
    errorResponse(res, 'Failed to retrieve blood test', 500);
  }
};

// Update blood test
const updateBloodTest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, testDate, labName, doctorName } = req.body;

    const bloodTest = await bloodTestService.updateBloodTest(
      id,
      userId,
      { title, testDate, labName, doctorName }
    );

    successResponse(res, bloodTest, 'Blood test updated successfully');
  } catch (error) {
    console.error('Update blood test error:', error);
    
    if (error.message === 'Blood test not found') {
      return notFoundResponse(res, 'Blood test not found');
    }
    
    errorResponse(res, 'Failed to update blood test', 500);
  }
};

// Delete blood test
const deleteBloodTest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    await bloodTestService.deleteBloodTest(id, userId);

    successResponse(res, null, 'Blood test deleted successfully');
  } catch (error) {
    console.error('Delete blood test error:', error);
    
    if (error.message === 'Blood test not found') {
      return notFoundResponse(res, 'Blood test not found');
    }
    
    errorResponse(res, 'Failed to delete blood test', 500);
  }
};

// Get blood test analysis
const getAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await bloodTestService.getAnalysis(id, userId);

    successResponse(res, result, 'Analysis retrieved successfully');
  } catch (error) {
    console.error('Get analysis error:', error);
    
    if (error.message === 'Blood test not found') {
      return notFoundResponse(res, 'Blood test not found');
    }
    
    if (error.message === 'Blood test analysis not available') {
      return errorResponse(res, 'Analysis not available yet', 400);
    }
    
    errorResponse(res, 'Failed to retrieve analysis', 500);
  }
};

// Reprocess blood test
const reprocessBloodTest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Get blood test to verify ownership
    const bloodTest = await bloodTestService.getBloodTestById(id, userId);
    
    if (!bloodTest) {
      return notFoundResponse(res, 'Blood test not found');
    }

    // Get OpenAI API key from request headers
    const openaiApiKey = req.headers['x-openai-api-key'];
    if (!openaiApiKey) {
      return errorResponse(res, 'OpenAI API key is required', 400);
    }

    // Start reprocessing
    const result = await bloodTestService.processBloodTest(id, {
      age: req.user.age,
      gender: req.user.gender,
      openaiApiKey
    });

    successResponse(res, result, 'Blood test reprocessed successfully');
  } catch (error) {
    console.error('Reprocess error:', error);
    
    if (error.message === 'Blood test not found') {
      return notFoundResponse(res, 'Blood test not found');
    }
    
    errorResponse(res, 'Failed to reprocess blood test', 500);
  }
};

// Get processing status
const getProcessingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const bloodTest = await bloodTestService.getBloodTestById(id, userId);

    successResponse(res, {
      id: bloodTest._id,
      status: bloodTest.status,
      processingError: bloodTest.processingError,
      progress: bloodTest.status === 'processing' ? 'In progress...' : 'Complete'
    }, 'Processing status retrieved successfully');
  } catch (error) {
    console.error('Get processing status error:', error);
    
    if (error.message === 'Blood test not found') {
      return notFoundResponse(res, 'Blood test not found');
    }
    
    errorResponse(res, 'Failed to get processing status', 500);
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await bloodTestService.getDashboardStats(userId);

    successResponse(res, stats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    errorResponse(res, 'Failed to retrieve dashboard statistics', 500);
  }
};

module.exports = {
  uploadBloodTest,
  getBloodTests,
  getBloodTest,
  updateBloodTest,
  deleteBloodTest,
  getAnalysis,
  reprocessBloodTest,
  getProcessingStatus,
  getDashboardStats
}; 