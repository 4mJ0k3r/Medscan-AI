const fs = require('fs');
const path = require('path');

// Delete file from filesystem
const deleteFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Check if file exists
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Get file size
const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};

// Create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Get file extension
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

// Generate unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const extension = getFileExtension(originalName);
  const basename = path.basename(originalName, extension);
  
  return `${basename}-${timestamp}-${random}${extension}`;
};

// Validate file type
const isValidFileType = (mimetype) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/jpg',
    'application/pdf'
  ];
  return allowedTypes.includes(mimetype);
};

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

module.exports = {
  deleteFile,
  fileExists,
  getFileSize,
  ensureDirectoryExists,
  getFileExtension,
  generateUniqueFilename,
  isValidFileType,
  formatFileSize
}; 