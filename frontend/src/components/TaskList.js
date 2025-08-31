import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import TaskItem from './TaskItem';

const TaskList = ({ 
  tasks, 
  loading, 
  filters, 
  onFilterChange, 
  onTaskUpdated, 
  onTaskDeleted 
}) => {
  const handleStatusFilter = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handlePriorityFilter = (e) => {
    onFilterChange({ ...filters, priority: e.target.value });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3>Your Tasks ({tasks.length})</h3>
        <div className="task-filters">
          <select 
            value={filters.status} 
            onChange={handleStatusFilter}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          
          <select 
            value={filters.priority} 
            onChange={handlePriorityFilter}
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>
            {filters.status || filters.priority 
              ? 'Try adjusting your filters or create a new task.' 
              : 'Create your first task to get started!'
            }
          </p>
        </div>
      ) : (
        <div>
          {tasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
