const mongoose = require('mongoose');

const bloodTestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  },
  fileSize: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'analyzed', 'failed'],
    default: 'uploaded'
  },
  extractedText: {
    type: String
  },
  analysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    summary: String,
    keyFindings: [{
      parameter: String,
      value: String,
      referenceRange: String,
      status: {
        type: String,
        enum: ['normal', 'high', 'low', 'critical']
      },
      recommendation: String
    }],
    recommendations: [String],
    nextSteps: [String],
    riskFactors: [{
      factor: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      description: String
    }]
  },
  processingError: {
    type: String
  },
  testDate: {
    type: Date
  },
  labName: {
    type: String
  },
  doctorName: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
bloodTestSchema.index({ user: 1, createdAt: -1 });
bloodTestSchema.index({ status: 1 });

// Virtual for file URL
bloodTestSchema.virtual('fileUrl').get(function() {
  return `/uploads/${this.fileName}`;
});

// Ensure virtual fields are serialized
bloodTestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('BloodTest', bloodTestSchema); 