const { ChatOpenAI } = require('@langchain/openai');

// Initialize OpenAI client
const openai = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  modelName: 'gpt-4o-mini', // Cost-effective model for blood test analysis
});

// Alternative model for more complex analysis
const openaiAdvanced = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.3,
  modelName: 'gpt-4o',
});

module.exports = {
  openai,
  openaiAdvanced
}; 