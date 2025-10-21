const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    name: String,
    age: Number,
    gender: String,
    height: Number, // in cm
    weight: Number, // in kg
    fitnessLevel: String, // beginner, intermediate, advanced
    goals: [String], // fitness, career, health, relationships, etc.
    preferences: {
      workoutTime: String,
      dietaryRestrictions: [String],
      availableTime: Number // hours per day
    }
  },
  assessment: {
    completed: { type: Boolean, default: false },
    responses: mongoose.Schema.Types.Mixed,
    initialConfidence: { type: Number, default: 0 },
    currentConfidence: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
