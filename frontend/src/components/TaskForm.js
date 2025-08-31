import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { taskService } from '../services/taskService';
import { Plus, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskForm = ({ onTaskCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const categories = [
    'Work', 'Personal', 'Health', 'Education', 'Finance', 
    'Travel', 'Shopping', 'Family', 'Projects', 'Other'
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await taskService.createTask(data);
      onTaskCreated(result);
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-form">
      <div className="task-form-header">
        <h3>✨ Create New Task</h3>
        <button
          type="button"
          className={`btn ${isOpen ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={18} /> : <Plus size={18} />}
          {isOpen ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit(onSubmit)} className="task-form-content">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              {...register('title', {
                required: 'Task title is required',
                maxLength: {
                  value: 100,
                  message: 'Title cannot exceed 100 characters'
                }
              })}
              placeholder="What needs to be done?"
            />
            {errors.title && (
              <span className="error">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters'
                }
              })}
              placeholder="Add more details about this task..."
              rows="3"
            />
            {errors.description && (
              <span className="error">{errors.description.message}</span>
            )}
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" {...register('priority')}>
                <option value="low">🔵 Low</option>
                <option value="medium" defaultValue>🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" {...register('category')}>
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                {...register('dueDate')}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              <Save size={18} />
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
