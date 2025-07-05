const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

class OCRService {
  constructor() {
    this.tesseractWorker = null;
  }

  // Initialize Tesseract worker
  async initializeTesseract() {
    if (!this.tesseractWorker) {
      this.tesseractWorker = await Tesseract.createWorker();
      await this.tesseractWorker.loadLanguage('eng');
      await this.tesseractWorker.initialize('eng');
    }
    return this.tesseractWorker;
  }

  // Extract text from image files
  async extractTextFromImage(imagePath) {
    try {
      const worker = await this.initializeTesseract();
      
      console.log('Starting OCR processing for image:', imagePath);
      
      const { data: { text } } = await worker.recognize(imagePath);
      
      console.log('OCR processing completed');
      
      return {
        success: true,
        text: text.trim(),
        confidence: 'high' // Tesseract provides confidence but simplified here
      };
    } catch (error) {
      console.error('OCR Error:', error);
      return {
        success: false,
        error: error.message,
        text: ''
      };
    }
  }

  // Extract text from PDF files with smart fallback approach
  async extractTextFromPDF(pdfPath) {
    console.log('Starting PDF text extraction:', pdfPath);
    
    // Method 1: Try direct text extraction first (fastest for text-based PDFs)
    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);
      
      if (data.text && data.text.trim().length > 50) {
        console.log('PDF text extraction completed (direct method)');
        return {
          success: true,
          text: data.text.trim(),
          pages: data.numpages,
          info: data.info,
          method: 'pdf-direct-text'
        };
      }
    } catch (error) {
      console.warn('Direct PDF text extraction failed:', error.message);
    }

    // Method 2: Try with different options for problematic PDFs
    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer, {
        max: 0, // Parse all pages
        normalizeWhitespace: false,
        disableCombineTextItems: false
      });
      
      if (data.text && data.text.trim().length > 10) {
        console.log('PDF text extraction completed (lenient method)');
        return {
          success: true,
          text: data.text.trim(),
          pages: data.numpages,
          info: data.info,
          method: 'pdf-lenient-text'
        };
      }
    } catch (error) {
      console.warn('Lenient PDF text extraction failed:', error.message);
    }

    // If we reach here, this is likely an image-based PDF
    console.log('PDF appears to be image-based, providing conversion guidance');
    return {
      success: false,
      error: 'This PDF contains images rather than extractable text. For best results, please convert your PDF to a JPG or PNG image and upload that instead.',
      text: '',
      method: 'image-pdf-detected',
      suggestion: 'convert-to-image'
    };
  }



  // Main method to extract text based on file type
  async extractText(filePath, fileType) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }

      let result;
      
      if (fileType === 'application/pdf') {
        result = await this.extractTextFromPDF(filePath);
        
        // If PDF extraction failed, provide helpful error message
        if (!result.success) {
          if (result.suggestion === 'convert-to-image') {
            result.error = 'This PDF contains images rather than extractable text. Please convert your PDF to a JPG or PNG image and upload that instead for better text recognition.';
          } else {
            result.error = result.error || 'PDF processing failed. Please ensure the document contains clear, readable text and try again.';
          }
        }
      } else if (fileType.startsWith('image/')) {
        result = await this.extractTextFromImage(filePath);
        
        // If image OCR failed, provide helpful error message
        if (!result.success) {
          result.error = 'Image text recognition failed. Please ensure the image is clear and contains readable text.';
        }
      } else {
        throw new Error('Unsupported file type. Please upload PDF, JPG, or PNG files only.');
      }

      // Clean and validate extracted text
      if (result.success && result.text) {
        result.text = this.cleanExtractedText(result.text);
        result.wordCount = result.text.split(/\s+/).length;
        
        // Check if we extracted enough text
        if (result.wordCount < 10) {
          result.success = false;
          result.error = 'Insufficient text extracted from the file. Please ensure the document contains readable text and try again.';
        }
      }

      return result;
    } catch (error) {
      console.error('Text extraction error:', error);
      return {
        success: false,
        error: error.message,
        text: ''
      };
    }
  }

  // Clean and format extracted text
  cleanExtractedText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .replace(/[^\w\s\n\.\,\:\;\-\(\)\/\%\<\>]/g, '') // Remove special characters but keep common ones
      .trim();
  }

  // Validate if extracted text looks like a blood test report
  validateBloodTestContent(text) {
    const bloodTestKeywords = [
      'hemoglobin', 'hgb', 'hematocrit', 'hct', 'platelet', 'plt',
      'white blood cell', 'wbc', 'red blood cell', 'rbc',
      'glucose', 'cholesterol', 'triglyceride', 'hdl', 'ldl',
      'creatinine', 'urea', 'bilirubin', 'protein', 'albumin',
      'reference range', 'normal range', 'lab', 'laboratory'
    ];

    const lowerText = text.toLowerCase();
    const foundKeywords = bloodTestKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );

    return {
      isValid: foundKeywords.length >= 3,
      confidence: foundKeywords.length / bloodTestKeywords.length,
      foundKeywords
    };
  }

  // Cleanup method to terminate Tesseract worker
  async cleanup() {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
    }
  }
}

module.exports = new OCRService(); 