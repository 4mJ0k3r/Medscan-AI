const { ChatOpenAI } = require('@langchain/openai');

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

// Initialize Groq client (OpenAI-compatible API)
const llm = new ChatOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.7,
  model: 'openai/gpt-oss-120b',
  configuration: {
    baseURL: GROQ_BASE_URL,
  },
});

// Alternative client for more complex analysis
const llmAdvanced = new ChatOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  temperature: 0.3,
  model: 'openai/gpt-oss-120b',
  configuration: {
    baseURL: GROQ_BASE_URL,
  },
});

module.exports = {
  openai: llm,
  openaiAdvanced: llmAdvanced
};