const axios = require('axios');
const { 
  BLOOD_TEST_ANALYSIS_SYSTEM_PROMPT, 
  createBloodTestAnalysisPrompt 
} = require('../prompts/bloodTestAnalysis');

class AnalysisService {
  constructor() {
    this.maxRetries = 3;
  }

  // Analyze blood test results using Groq
  async analyzeBloodTest(extractedText, userInfo = {}, apiKey = null) {
    try {
      console.log('Starting blood test analysis...');
      
      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error('Insufficient text data for analysis');
      }

      if (!apiKey) {
        throw new Error('Groq API key is required');
      }

      const userPrompt = createBloodTestAnalysisPrompt(extractedText, userInfo);
      
      const response = await this.callGroq(
        BLOOD_TEST_ANALYSIS_SYSTEM_PROMPT,
        userPrompt,
        apiKey
      );

      console.log('Blood test analysis completed');
      
      return {
        success: true,
        analysis: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Analysis error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        analysis: null
      };
    }
  }

  // Call Groq API with retry logic
  async callGroq(systemPrompt, userPrompt, apiKey, retries = 0) {
    try {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        // Reasoning tokens count against this budget, so keep it generous
        max_completion_tokens: 8000,
        reasoning_effort: 'low',
        response_format: { type: 'json_object' }
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      });

      const content = response.data.choices[0].message.content;

      // Parse JSON response
      const cleanedResponse = this.cleanJsonResponse(content);
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Validate response structure
      this.validateAnalysisResponse(parsedResponse);
      
      return parsedResponse;
    } catch (error) {
      console.error(`Groq API error (attempt ${retries + 1}):`, error.response?.data || error.message);
      
      if (retries < this.maxRetries) {
        console.log(`Retrying... (${retries + 1}/${this.maxRetries})`);
        await this.delay(1000 * (retries + 1)); // Exponential backoff
        return this.callGroq(systemPrompt, userPrompt, apiKey, retries + 1);
      }
      
      throw error;
    }
  }

  // Clean JSON response from Groq
  cleanJsonResponse(response) {
    // Remove any markdown formatting
    let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();
    
    // Ensure it starts with { and ends with }
    if (!cleaned.startsWith('{')) {
      const startIndex = cleaned.indexOf('{');
      if (startIndex !== -1) {
        cleaned = cleaned.substring(startIndex);
      }
    }
    
    if (!cleaned.endsWith('}')) {
      const endIndex = cleaned.lastIndexOf('}');
      if (endIndex !== -1) {
        cleaned = cleaned.substring(0, endIndex + 1);
      }
    }
    
    return cleaned;
  }

  // Validate analysis response structure
  validateAnalysisResponse(response) {
    const requiredFields = ['overallScore', 'summary', 'keyFindings', 'recommendations'];
    
    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate overallScore
    if (typeof response.overallScore !== 'number' || 
        response.overallScore < 0 || 
        response.overallScore > 100) {
      throw new Error('Invalid overallScore: must be a number between 0 and 100');
    }

    // Validate keyFindings structure
    if (!Array.isArray(response.keyFindings)) {
      throw new Error('keyFindings must be an array');
    }

    // Validate recommendations
    if (!Array.isArray(response.recommendations)) {
      throw new Error('recommendations must be an array');
    }
  }

  // Generate health insights based on analysis
  async generateHealthInsights(analysis) {
    try {
      const insights = {
        healthScore: analysis.overallScore,
        riskLevel: this.calculateRiskLevel(analysis.overallScore),
        priorityActions: this.extractPriorityActions(analysis),
        followUpRecommendations: this.generateFollowUpRecommendations(analysis),
        lifestyleFactors: this.identifyLifestyleFactors(analysis)
      };

      return insights;
    } catch (error) {
      console.error('Error generating health insights:', error);
      throw error;
    }
  }

  // Calculate risk level based on overall score
  calculateRiskLevel(score) {
    if (score >= 85) return 'low';
    if (score >= 70) return 'moderate';
    if (score >= 50) return 'high';
    return 'critical';
  }

  // Extract priority actions from analysis
  extractPriorityActions(analysis) {
    const criticalFindings = analysis.keyFindings?.filter(
      finding => finding.status === 'critical'
    ) || [];
    
    const highFindings = analysis.keyFindings?.filter(
      finding => finding.status === 'high'
    ) || [];

    return [
      ...criticalFindings.map(f => f.recommendation),
      ...highFindings.slice(0, 3).map(f => f.recommendation)
    ].filter(Boolean);
  }

  // Generate follow-up recommendations
  generateFollowUpRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.overallScore < 70) {
      recommendations.push('Schedule follow-up appointment with your healthcare provider within 2-4 weeks');
    }
    
    if (analysis.keyFindings?.some(f => f.status === 'critical')) {
      recommendations.push('Seek immediate medical attention for critical findings');
    }
    
    recommendations.push('Retest recommended values in 3-6 months');
    
    return recommendations;
  }

  // Identify lifestyle factors
  identifyLifestyleFactors(analysis) {
    const factors = [];
    
    const recommendations = analysis.recommendations || [];
    
    if (recommendations.some(r => r.toLowerCase().includes('exercise'))) {
      factors.push('Physical Activity');
    }
    
    if (recommendations.some(r => r.toLowerCase().includes('diet') || r.toLowerCase().includes('nutrition'))) {
      factors.push('Nutrition');
    }
    
    if (recommendations.some(r => r.toLowerCase().includes('sleep'))) {
      factors.push('Sleep Quality');
    }
    
    if (recommendations.some(r => r.toLowerCase().includes('stress'))) {
      factors.push('Stress Management');
    }
    
    return factors;
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new AnalysisService(); 