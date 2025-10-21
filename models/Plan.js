const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  tasks: [{
    id: String,
    title: String,
    description: String,
    category: String, // fitness, career, health, relationships, etc.
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    estimatedTime: Number, // in minutes
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }],
  aiGenerated: {
    type: Boolean,
    default: true
  },
  confidenceImpact: {
    type: Number,
    default: 0 // positive or negative impact on confidence
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
planSchema.index({ userId: 1, date: -1 });
planSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Plan', planSchema);
