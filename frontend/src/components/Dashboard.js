import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: ''
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskCreated = (newTask) => {
    setTasks(prevTasks => [newTask.task, ...prevTasks]);
    toast.success('Task created successfully! 🎉');
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === updatedTask.task._id ? updatedTask.task : task
      )
    );
    toast.success('Task updated successfully! ✅');
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    toast.success('Task deleted successfully! 🗑️');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBulkAction = async (action, taskIds) => {
    try {
      if (action === 'delete') {
        await Promise.all(taskIds.map(id => taskService.deleteTask(id)));
        setTasks(prevTasks => prevTasks.filter(task => !taskIds.includes(task._id)));
        toast.success(`${taskIds.length} tasks deleted successfully!`);
      } else if (action === 'complete') {
        const updates = await Promise.all(
          taskIds.map(async (id) => {
            const task = tasks.find(t => t._id === id);
            if (task && task.status === 'pending') {
              return await taskService.toggleTaskStatus(id);
            }
            return null;
          })
        );
        
        updates.filter(Boolean).forEach(update => {
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task._id === update.task._id ? update.task : task
            )
          );
        });
        toast.success(`${updates.filter(Boolean).length} tasks marked as completed!`);
      }
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === 'pending').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    overdue: tasks.filter(task => 
      task.status === 'pending' && 
      task.dueDate && 
      new Date(task.dueDate) < new Date()
    ).length,
    highPriority: tasks.filter(task => 
      task.priority === 'high' && task.status === 'pending'
    ).length
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <div className="welcome-text">Welcome back,</div>
            <h1>{user.username}! 👋</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Let's get things done today
            </p>
          </div>
        </div>

        <TaskStats stats={stats} />
        
        <TaskForm onTaskCreated={handleTaskCreated} />
        
        <TaskList
          tasks={tasks}
          loading={loading}
          filters={filters}
          onFilterChange={handleFilterChange}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          onBulkAction={handleBulkAction}
        />
      </div>
    </div>
  );
};

export default Dashboard;
