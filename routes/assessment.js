const express = require('express');
const User = require('../models/User');
const { generatePersonalizedPlan } = require('../services/aiService');
const router = express.Router();

// Get assessment questions
router.get('/questions', (req, res) => {
  const questions = [
    {
      id: 'goals',
      question: 'What are your main goals? (Select all that apply)',
      type: 'multiple',
      options: [
        'Physical fitness and health',
        'Career advancement',
        'Mental health and wellness',
        'Learning new skills',
        'Building relationships',
        'Financial stability',
        'Creative pursuits',
        'Spiritual growth'
      ]
    },
    {
      id: 'fitness_level',
      question: 'How would you describe your current fitness level?',
      type: 'single',
      options: ['Beginner', 'Intermediate', 'Advanced', 'Athlete']
    },
    {
      id: 'available_time',
      question: 'How much time can you dedicate daily to personal development?',
      type: 'single',
      options: ['30 minutes', '1 hour', '2 hours', '3+ hours']
    },
    {
      id: 'motivation',
      question: 'What motivates you most?',
      type: 'single',
      options: [
        'Achieving specific goals',
        'Building habits',
        'Learning new things',
        'Helping others',
        'Personal growth',
        'Recognition and success'
      ]
    },
    {
      id: 'challenges',
      question: 'What are your biggest challenges? (Select all that apply)',
      type: 'multiple',
      options: [
        'Time management',
        'Lack of motivation',
        'Unclear goals',
        'Poor habits',
        'Stress and anxiety',
        'Lack of accountability',
        'Perfectionism',
        'Fear of failure'
      ]
    },
    {
      id: 'preferences',
      question: 'What time of day do you prefer to work on personal development?',
      type: 'single',
      options: ['Early morning', 'Morning', 'Afternoon', 'Evening', 'Late night']
    },
    {
      id: 'confidence',
      question: 'On a scale of 1-10, how confident do you feel about achieving your goals?',
      type: 'scale',
      min: 1,
      max: 10
    }
  ];

  res.json(questions);
});

// Submit assessment
router.post('/submit', async (req, res) => {
  try {
    const { userId, responses } = req.body;

    // Calculate initial confidence score
    const confidenceScore = calculateConfidenceScore(responses);

    // Update user with assessment data
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'assessment.completed': true,
          'assessment.responses': responses,
          'assessment.initialConfidence': confidenceScore,
          'assessment.currentConfidence': confidenceScore
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate personalized plan
    const plan = await generatePersonalizedPlan(user, responses);

    res.json({
      message: 'Assessment completed successfully',
      confidenceScore,
      plan
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing assessment', error: error.message });
  }
});

// Calculate confidence score based on responses
function calculateConfidenceScore(responses) {
  let score = 50; // Base score

  // Adjust based on confidence self-rating
  if (responses.confidence) {
    score = responses.confidence * 10;
  }

  // Adjust based on available time
  if (responses.available_time) {
    const timeMultiplier = {
      '30 minutes': 0.8,
      '1 hour': 1.0,
      '2 hours': 1.2,
      '3+ hours': 1.3
    };
    score *= timeMultiplier[responses.available_time] || 1.0;
  }

  // Adjust based on motivation level
  if (responses.motivation) {
    const motivationBonus = {
      'Achieving specific goals': 10,
      'Building habits': 15,
      'Learning new things': 10,
      'Helping others': 5,
      'Personal growth': 15,
      'Recognition and success': 8
    };
    score += motivationBonus[responses.motivation] || 0;
  }

  // Penalty for challenges
  if (responses.challenges && responses.challenges.length > 0) {
    score -= responses.challenges.length * 5;
  }

  // Ensure score is within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = router;
