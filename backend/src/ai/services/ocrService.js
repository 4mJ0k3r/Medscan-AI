const axios = require('axios');
const pdf = require('pdf-parse');
const fs = require('fs');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_VISION_MODEL = 'qwen/qwen3.8-27b';

const OCR_PROMPT = `Transcribe all text from this blood test report image exactly as printed.
Preserve parameter names, values, units, and reference ranges.
Output plain text only, one table row per line, with no commentary or markdown.
If a value is illegible, write [illegible] in its place.`;

class OCRService {
  // Extract text from image files using Groq vision
  async extractTextFromImage(imagePath, fileType, apiKey) {
    if (!apiKey) {
      return {
        success: false,
        error: 'Groq API key is required for image text extraction',
        text: ''
      };
    }

    try {
      console.log('Starting Groq vision OCR for image:', imagePath);

      const base64Image = fs.readFileSync(imagePath).toString('base64');

      const response = await axios.post(GROQ_API_URL, {
        model: GROQ_VISION_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: OCR_PROMPT },
              { type: 'image_url', image_url: { url: `data:${fileType};base64,${base64Image}` } }
            ]
          }
        ],
        temperature: 0,
        max_completion_tokens: 8000
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      });

      const text = response.data.choices[0].message.content;

      console.log('Groq vision OCR completed');

      return {
        success: true,
        text: (text || '').trim(),
        method: 'groq-vision'
      };
    } catch (error) {
      console.error('Groq vision OCR error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
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
  async extractText(filePath, fileType, groqApiKey) {
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
        result = await this.extractTextFromImage(filePath, fileType, groqApiKey);
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
      .replace(/[ \t]+/g, ' ') // Collapse horizontal whitespace, keep line structure
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
}

module.exports = new OCRService();