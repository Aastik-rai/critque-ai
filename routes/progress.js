const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { updateConfidenceScore } = require('../services/aiService');
const router = express.Router();

// Get progress data
router.get('/', async (req, res) => {
  try {
    const { userId, days = 7 } = req.query;

    const progress = await Progress.find({ userId })
      .sort({ date: -1 })
      .limit(parseInt(days));

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

// Submit daily progress
router.post('/submit', async (req, res) => {
  try {
    const { userId, tasksCompleted, totalTasks, mood, notes, achievements, challenges, nextDayGoals } = req.body;

    const completionRate = (tasksCompleted / totalTasks) * 100;

    // Update confidence score
    const newConfidence = await updateConfidenceScore(userId, tasksCompleted, totalTasks);

    // Get user for current confidence
    const user = await User.findById(userId);
    const currentConfidence = user.assessment.currentConfidence;

    // Create progress entry
    const progress = new Progress({
      userId,
      confidenceScore: newConfidence,
      tasksCompleted,
      totalTasks,
      completionRate,
      mood,
      notes,
      achievements,
      challenges,
      nextDayGoals
    });

    await progress.save();

    res.json({
      message: 'Progress submitted successfully',
      progress,
      confidenceChange: newConfidence - currentConfidence,
      newConfidence
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting progress', error: error.message });
  }
});

// Get confidence trend
router.get('/confidence', async (req, res) => {
  try {
    const { userId, days = 30 } = req.query;

    const progress = await Progress.find({ userId })
      .select('date confidenceScore')
      .sort({ date: -1 })
      .limit(parseInt(days));

    const trend = progress.map(p => ({
      date: p.date,
      confidence: p.confidenceScore
    })).reverse();

    res.json(trend);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching confidence trend', error: error.message });
  }
});

// Get completion statistics
router.get('/stats', async (req, res) => {
  try {
    const { userId, days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const progress = await Progress.find({
      userId,
      date: { $gte: startDate }
    });

    if (progress.length === 0) {
      return res.json({
        averageCompletion: 0,
        averageConfidence: 0,
        totalTasks: 0,
        completedTasks: 0,
        streak: 0
      });
    }

    const totalTasks = progress.reduce((sum, p) => sum + p.totalTasks, 0);
    const completedTasks = progress.reduce((sum, p) => sum + p.tasksCompleted, 0);
    const averageCompletion = (completedTasks / totalTasks) * 100;
    const averageConfidence = progress.reduce((sum, p) => sum + p.confidenceScore, 0) / progress.length;

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < progress.length; i++) {
      const progressDate = new Date(progress[i].date);
      progressDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((today - progressDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === i && progress[i].completionRate >= 50) {
        streak++;
      } else {
        break;
      }
    }

    res.json({
      averageCompletion: Math.round(averageCompletion),
      averageConfidence: Math.round(averageConfidence),
      totalTasks,
      completedTasks,
      streak
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;
