const express = require('express');
const Plan = require('../models/Plan');
const { generatePersonalizedPlan } = require('../services/aiService');
const router = express.Router();

// Get today's plan
router.get('/today', async (req, res) => {
  try {
    const { userId } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plan = await Plan.findOne({
      userId,
      date: { $gte: today },
      status: 'active'
    }).sort({ createdAt: -1 });

    if (!plan) {
      return res.status(404).json({ message: 'No plan found for today' });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan', error: error.message });
  }
});

// Generate new plan
router.post('/generate', async (req, res) => {
  try {
    const { userId } = req.body;

    // Get user data
    const User = require('../models/User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.assessment.completed) {
      return res.status(400).json({ message: 'Assessment must be completed first' });
    }

    // Generate new plan
    const plan = await generatePersonalizedPlan(user, user.assessment.responses);

    res.json({
      message: 'Plan generated successfully',
      plan
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating plan', error: error.message });
  }
});

// Update task completion
router.patch('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed, planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Update task
    const task = plan.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = completed;
    if (completed) {
      task.completedAt = new Date();
    } else {
      task.completedAt = undefined;
    }

    await plan.save();

    // Calculate completion rate
    const completedTasks = plan.tasks.filter(t => t.completed).length;
    const totalTasks = plan.tasks.length;
    const completionRate = (completedTasks / totalTasks) * 100;

    res.json({
      message: 'Task updated successfully',
      task,
      completionRate,
      completedTasks,
      totalTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Get plan history
router.get('/history', async (req, res) => {
  try {
    const { userId, limit = 7 } = req.query;

    const plans = await Plan.find({ userId })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan history', error: error.message });
  }
});

// Complete entire plan
router.patch('/complete', async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await Plan.findByIdAndUpdate(
      planId,
      { status: 'completed' },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({
      message: 'Plan completed successfully',
      plan
    });
  } catch (error) {
    res.status(500).json({ message: 'Error completing plan', error: error.message });
  }
});

module.exports = router;
