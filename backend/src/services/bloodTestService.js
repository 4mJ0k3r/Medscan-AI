const BloodTest = require('../models/BloodTest');
const ocrService = require('../ai/services/ocrService');
const analysisService = require('../ai/services/analysisService');
const { deleteFile } = require('../utils/fileUtils');

class BloodTestService {
  // Create new blood test record
  async createBloodTest(userId, fileData, metadata) {
    try {
      const bloodTest = new BloodTest({
        user: userId,
        title: metadata.title,
        originalFileName: fileData.originalname,
        fileName: fileData.filename,
        filePath: fileData.path,
        fileType: fileData.mimetype,
        fileSize: fileData.size,
        testDate: metadata.testDate,
        labName: metadata.labName,
        doctorName: metadata.doctorName,
        status: 'uploaded'
      });

      await bloodTest.save();
      return bloodTest;
    } catch (error) {
      console.error('Error creating blood test:', error);
      throw error;
    }
  }

  // Process blood test (OCR + Analysis)
  async processBloodTest(bloodTestId, userInfo = {}) {
    try {
      const bloodTest = await BloodTest.findById(bloodTestId);
      if (!bloodTest) {
        throw new Error('Blood test not found');
      }

      // Update status to processing
      bloodTest.status = 'processing';
      await bloodTest.save();

      console.log('Starting OCR processing for:', bloodTest.fileName);

      // Extract text using OCR
      const ocrResult = await ocrService.extractText(
        bloodTest.filePath,
        bloodTest.fileType
      );

      if (!ocrResult.success) {
        // Store the OCR error for user feedback
        bloodTest.processingError = `Text extraction failed: ${ocrResult.error}`;
        bloodTest.status = 'failed';
        await bloodTest.save();
        throw new Error(`OCR failed: ${ocrResult.error}`);
      }

      // Validate if it's a blood test report
      const validation = ocrService.validateBloodTestContent(ocrResult.text);
      if (!validation.isValid) {
        throw new Error('File does not appear to contain blood test results');
      }

      // Store extracted text
      bloodTest.extractedText = ocrResult.text;
      await bloodTest.save();

      console.log('Starting AI analysis...');

      // Analyze with AI
      const analysisResult = await analysisService.analyzeBloodTest(
        ocrResult.text,
        userInfo,
        userInfo.openaiApiKey
      );

      if (!analysisResult.success) {
        throw new Error(`Analysis failed: ${analysisResult.error}`);
      }

      // Store analysis results
      bloodTest.analysis = analysisResult.analysis;
      bloodTest.status = 'analyzed';
      await bloodTest.save();

      console.log('Blood test processing completed successfully');

      return {
        success: true,
        bloodTest: bloodTest,
        ocrResult: ocrResult,
        analysisResult: analysisResult
      };
    } catch (error) {
      console.error('Error processing blood test:', error);
      
      // Update status to failed
      try {
        await BloodTest.findByIdAndUpdate(bloodTestId, {
          status: 'failed',
          processingError: error.message
        });
      } catch (updateError) {
        console.error('Error updating failed status:', updateError);
      }

      throw error;
    }
  }

  // Get user's blood tests
  async getUserBloodTests(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        status
      } = options;

      const query = { user: userId, isDeleted: false };
      if (status) {
        query.status = status;
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const bloodTests = await BloodTest.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('user', 'name email');

      const total = await BloodTest.countDocuments(query);

      return {
        bloodTests,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      console.error('Error getting user blood tests:', error);
      throw error;
    }
  }

  // Get blood test by ID
  async getBloodTestById(id, userId) {
    try {
      const bloodTest = await BloodTest.findOne({
        _id: id,
        user: userId,
        isDeleted: false
      }).populate('user', 'name email');

      if (!bloodTest) {
        throw new Error('Blood test not found');
      }

      return bloodTest;
    } catch (error) {
      console.error('Error getting blood test:', error);
      throw error;
    }
  }

  // Update blood test
  async updateBloodTest(id, userId, updateData) {
    try {
      const bloodTest = await BloodTest.findOneAndUpdate(
        { _id: id, user: userId, isDeleted: false },
        updateData,
        { new: true, runValidators: true }
      );

      if (!bloodTest) {
        throw new Error('Blood test not found');
      }

      return bloodTest;
    } catch (error) {
      console.error('Error updating blood test:', error);
      throw error;
    }
  }

  // Delete blood test (soft delete)
  async deleteBloodTest(id, userId) {
    try {
      const bloodTest = await BloodTest.findOneAndUpdate(
        { _id: id, user: userId, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );

      if (!bloodTest) {
        throw new Error('Blood test not found');
      }

      // Optionally delete the physical file
      try {
        await deleteFile(bloodTest.filePath);
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Don't throw error if file deletion fails
      }

      return bloodTest;
    } catch (error) {
      console.error('Error deleting blood test:', error);
      throw error;
    }
  }

  // Get analysis for blood test
  async getAnalysis(id, userId) {
    try {
      const bloodTest = await this.getBloodTestById(id, userId);
      
      // Check if analysis is available
      if (!bloodTest.analysis || bloodTest.status === 'failed') {
        throw new Error('Blood test analysis not available');
      }

      // If still processing, return processing status
      if (bloodTest.status === 'processing') {
        return {
          bloodTest,
          analysis: null,
          status: 'processing',
          message: 'Analysis is still in progress. Please check back in a moment.'
        };
      }

      // Generate additional insights if analysis is complete
      let insights = null;
      try {
        insights = await analysisService.generateHealthInsights(
          bloodTest.analysis
        );
      } catch (insightError) {
        console.error('Error generating insights:', insightError);
        // Don't fail the whole request if insights fail
      }

      // Map field names for frontend compatibility
      const analysisResponse = {
        ...bloodTest.analysis,
        healthScore: bloodTest.analysis.overallScore, // Map overallScore to healthScore
        overallScore: bloodTest.analysis.overallScore // Keep both for compatibility
      };

      return {
        bloodTest,
        analysis: analysisResponse,
        insights,
        status: bloodTest.status
      };
    } catch (error) {
      console.error('Error getting analysis:', error);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats(userId) {
    try {
      const stats = await BloodTest.aggregate([
        { $match: { user: userId, isDeleted: false } },
        {
          $group: {
            _id: null,
            totalReports: { $sum: 1 },
            analyzedReports: {
              $sum: { $cond: [{ $eq: ['$status', 'analyzed'] }, 1, 0] }
            },
            processingReports: {
              $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
            },
            failedReports: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            },
            averageScore: {
              $avg: '$analysis.overallScore'
            }
          }
        }
      ]);

      // Get recent reports
      const recentReports = await BloodTest.find({
        user: userId,
        isDeleted: false
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title status createdAt analysis.overallScore');

      return {
        stats: stats[0] || {
          totalReports: 0,
          analyzedReports: 0,
          processingReports: 0,
          failedReports: 0,
          averageScore: null
        },
        recentReports
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }
}

module.exports = new BloodTestService(); 