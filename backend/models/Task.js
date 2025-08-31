const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Task title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Task description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Health', 'Education', 'Finance', 'Travel', 'Shopping', 'Family', 'Projects', 'Other'],
    default: 'Other'
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: [{
    content: {
      type: String,
      required: true,
      maxlength: 200
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, category: 1 });
taskSchema.index({ user: 1, priority: 1 });

module.exports = mongoose.model('Task', taskSchema);
