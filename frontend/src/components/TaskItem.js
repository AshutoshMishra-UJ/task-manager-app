import React, { useState } from 'react';
import { Check, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);
      const result = await taskService.toggleTaskStatus(task._id);
      onTaskUpdated(result);
    } catch (error) {
      console.error('Failed to toggle task status:', error);
      toast.error('Failed to update task status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        setIsLoading(true);
        const result = await taskService.updateTask(task._id, editData);
        onTaskUpdated(result);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update task:', error);
        toast.error('Failed to update task');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsLoading(true);
        await taskService.deleteTask(task._id);
        onTaskDeleted(task._id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        toast.error('Failed to delete task');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';

  return (
    <div className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-header">
        {isEditing ? (
          <div style={{ flex: 1 }}>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1.1rem',
                marginBottom: '0.5rem'
              }}
              placeholder="Task title"
            />
            <textarea
              name="description"
              value={editData.description}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '60px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              placeholder="Task description"
            />
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <h4 className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </div>
        )}

        <div className="task-actions">
          <button
            onClick={handleToggleStatus}
            className="btn-icon"
            title={task.status === 'pending' ? 'Mark as completed' : 'Mark as pending'}
            disabled={isLoading}
            style={{ 
              color: task.status === 'completed' ? '#28a745' : '#6c757d' 
            }}
          >
            <Check size={16} />
          </button>
          
          <button
            onClick={isEditing ? handleEdit : () => setIsEditing(true)}
            className="btn-icon"
            title={isEditing ? 'Save changes' : 'Edit task'}
            disabled={isLoading}
            style={{ color: isEditing ? '#28a745' : '#007bff' }}
          >
            <Edit size={16} />
          </button>
          
          {isEditing && (
            <button
              onClick={handleCancel}
              className="btn-icon"
              title="Cancel editing"
              style={{ color: '#6c757d' }}
            >
              <Clock size={16} />
            </button>
          )}
          
          <button
            onClick={handleDelete}
            className="btn-icon"
            title="Delete task"
            disabled={isLoading}
            style={{ color: '#dc3545' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="task-meta">
        <span className={`task-status ${task.status}`}>
          {task.status}
        </span>
        
        {isEditing ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              name="priority"
              value={editData.priority}
              onChange={handleInputChange}
              style={{
                padding: '0.25rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <input
              type="date"
              name="dueDate"
              value={editData.dueDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              style={{
                padding: '0.25rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}
            />
          </div>
        ) : (
          <>
            <span className={`task-priority ${task.priority}`}>
              {task.priority} priority
            </span>
            
            {task.dueDate && (
              <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                <Calendar size={14} style={{ marginRight: '0.25rem' }} />
                {formatDate(task.dueDate)}
              </span>
            )}
            
            <span style={{ color: '#999', fontSize: '0.75rem' }}>
              Created {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
