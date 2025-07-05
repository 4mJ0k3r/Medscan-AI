const express = require('express');
const router = express.Router();
const { successResponse, errorResponse } = require('../utils/responseUtils');

// Mock health facts data
const healthFacts = [
  {
    id: 1,
    text: "Regular exercise can increase HDL (good) cholesterol levels by up to 15%.",
    category: "Exercise"
  },
  {
    id: 2,
    text: "Vitamin D deficiency affects over 1 billion people worldwide and impacts immune function.",
    category: "Vitamins"
  },
  {
    id: 3,
    text: "Cholesterol levels can vary by up to 20% based on seasonal changes and stress levels.",
    category: "Cholesterol"
  },
  {
    id: 4,
    text: "Your liver produces about 80% of the cholesterol in your body, while only 20% comes from diet.",
    category: "Cholesterol"
  },
  {
    id: 5,
    text: "Iron deficiency is the most common nutritional deficiency worldwide, affecting 2 billion people.",
    category: "Minerals"
  },
  {
    id: 6,
    text: "Blood glucose levels can fluctuate by 10-15% throughout the day due to circadian rhythms.",
    category: "Glucose"
  },
  {
    id: 7,
    text: "Dehydration can cause blood to become thicker, affecting circulation and blood pressure.",
    category: "Hydration"
  },
  {
    id: 8,
    text: "The average adult has about 5 liters of blood, which circulates through the body 3 times per minute.",
    category: "Circulation"
  },
  {
    id: 9,
    text: "Omega-3 fatty acids can reduce triglyceride levels by 20-50% when taken regularly.",
    category: "Nutrition"
  },
  {
    id: 10,
    text: "Stress hormones like cortisol can temporarily increase blood sugar levels even in non-diabetics.",
    category: "Stress"
  },
  {
    id: 11,
    text: "Red blood cells live for about 120 days before being replaced by new ones.",
    category: "Blood Cells"
  },
  {
    id: 12,
    text: "Magnesium deficiency can affect over 300 enzyme reactions in your body.",
    category: "Minerals"
  },
  {
    id: 13,
    text: "Your kidneys filter about 50 gallons of blood every day to remove waste products.",
    category: "Kidneys"
  },
  {
    id: 14,
    text: "B12 deficiency can take years to develop because the liver stores 3-5 years worth of this vitamin.",
    category: "Vitamins"
  },
  {
    id: 15,
    text: "Thyroid hormones regulate metabolism in every cell of your body.",
    category: "Thyroid"
  }
];

// Get random health facts
router.get('/random', (req, res) => {
  try {
    const count = parseInt(req.query.count) || 2;
    const maxCount = Math.min(count, 5); // Limit to 5 facts max
    
    // Shuffle array and get random facts
    const shuffled = healthFacts.sort(() => 0.5 - Math.random());
    const randomFacts = shuffled.slice(0, maxCount);
    
    successResponse(res, randomFacts, 'Random health facts retrieved successfully');
  } catch (error) {
    console.error('Error getting random health facts:', error);
    errorResponse(res, 'Failed to retrieve health facts', 500);
  }
});

// Get all health facts
router.get('/', (req, res) => {
  try {
    successResponse(res, healthFacts, 'All health facts retrieved successfully');
  } catch (error) {
    console.error('Error getting all health facts:', error);
    errorResponse(res, 'Failed to retrieve health facts', 500);
  }
});

module.exports = router; 