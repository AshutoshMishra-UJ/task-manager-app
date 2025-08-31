const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    
    const filter = { user: req.user._id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error while fetching task' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: req.user._id
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Toggle task status
// @access  Private
router.patch('/:id/status', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    res.json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Toggle task status error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error while updating task status' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

module.exports = router;
