const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  totalTasks: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  categories: [{
    name: String,
    completed: Number,
    total: Number,
    rate: Number
  }],
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible'],
    default: 'okay'
  },
  notes: String,
  achievements: [String],
  challenges: [String],
  nextDayGoals: [String]
});

// Index for efficient queries
progressSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
