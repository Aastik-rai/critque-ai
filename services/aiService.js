const OpenAI = require('openai');
const Plan = require('../models/Plan');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key'
});

// Generate personalized daily plan
async function generatePersonalizedPlan(user, assessmentResponses) {
  try {
    const prompt = createPlanPrompt(user, assessmentResponses);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert personal development coach. Create detailed, actionable daily plans that help users achieve their goals. Focus on realistic, achievable tasks that build confidence and momentum."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const planContent = completion.choices[0].message.content;
    const parsedPlan = parsePlanResponse(planContent);

    // Save plan to database
    const plan = new Plan({
      userId: user._id,
      date: new Date(),
      tasks: parsedPlan.tasks,
      aiGenerated: true,
      confidenceImpact: parsedPlan.confidenceImpact
    });

    await plan.save();

    return {
      planId: plan._id,
      tasks: parsedPlan.tasks,
      confidenceImpact: parsedPlan.confidenceImpact,
      aiInsights: parsedPlan.insights
    };
  } catch (error) {
    console.error('Error generating plan:', error);
    throw new Error('Failed to generate personalized plan');
  }
}

// Create prompt for AI plan generation
function createPlanPrompt(user, responses) {
  const goals = responses.goals || [];
  const fitnessLevel = responses.fitness_level || 'Beginner';
  const availableTime = responses.available_time || '1 hour';
  const challenges = responses.challenges || [];
  const preferences = responses.preferences || 'Morning';

  return `
Create a personalized daily plan for a user with the following profile:

GOALS: ${goals.join(', ')}
FITNESS LEVEL: ${fitnessLevel}
AVAILABLE TIME: ${availableTime}
PREFERRED TIME: ${preferences}
CHALLENGES: ${challenges.join(', ')}

User Profile:
- Name: ${user.profile.name}
- Age: ${user.profile.age || 'Not specified'}
- Current Confidence: ${user.assessment.currentConfidence}/100

Please create a daily plan with 5-8 specific, actionable tasks that:
1. Address their main goals
2. Are appropriate for their fitness level
3. Fit within their available time
4. Consider their challenges
5. Build confidence through achievable wins

Format your response as JSON with this structure:
{
  "tasks": [
    {
      "id": "task_1",
      "title": "Task Title",
      "description": "Detailed description",
      "category": "fitness/career/health/relationships/learning",
      "priority": "low/medium/high",
      "estimatedTime": 30,
      "difficulty": "easy/medium/hard"
    }
  ],
  "confidenceImpact": 5,
  "insights": "Brief motivational insight about the plan"
}

Make sure tasks are:
- Specific and actionable
- Realistic for their level
- Balanced across different life areas
- Designed to build momentum
- Include at least one quick win (easy task)
`;

}

// Parse AI response into structured format
function parsePlanResponse(content) {
  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Ensure all required fields are present
    const tasks = parsed.tasks.map((task, index) => ({
      id: task.id || `task_${index + 1}`,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      category: task.category || 'general',
      priority: task.priority || 'medium',
      estimatedTime: task.estimatedTime || 30,
      difficulty: task.difficulty || 'medium',
      completed: false
    }));

    return {
      tasks,
      confidenceImpact: parsed.confidenceImpact || 0,
      insights: parsed.insights || 'You\'ve got this! Start with the easiest task to build momentum.'
    };
  } catch (error) {
    console.error('Error parsing plan response:', error);
    // Return fallback plan
    return {
      tasks: [
        {
          id: 'task_1',
          title: 'Morning Reflection',
          description: 'Take 5 minutes to write down your top 3 priorities for today',
          category: 'general',
          priority: 'high',
          estimatedTime: 5,
          difficulty: 'easy',
          completed: false
        },
        {
          id: 'task_2',
          title: 'Physical Activity',
          description: 'Do 10 minutes of any physical activity you enjoy',
          category: 'fitness',
          priority: 'medium',
          estimatedTime: 10,
          difficulty: 'easy',
          completed: false
        }
      ],
      confidenceImpact: 3,
      insights: 'Start small and build momentum. Every step forward counts!'
    };
  }
}

// Update confidence score based on task completion
async function updateConfidenceScore(userId, completedTasks, totalTasks) {
  try {
    const completionRate = completedTasks / totalTasks;
    const confidenceChange = Math.round((completionRate - 0.5) * 10); // -5 to +5 based on completion rate

    const user = await User.findById(userId);
    if (!user) return;

    const newConfidence = Math.max(0, Math.min(100, 
      user.assessment.currentConfidence + confidenceChange
    ));

    await User.findByIdAndUpdate(userId, {
      'assessment.currentConfidence': newConfidence
    });

    return newConfidence;
  } catch (error) {
    console.error('Error updating confidence score:', error);
    throw error;
  }
}

module.exports = {
  generatePersonalizedPlan,
  updateConfidenceScore
};
