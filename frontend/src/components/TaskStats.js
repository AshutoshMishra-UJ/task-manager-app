import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Target 
} from 'lucide-react';

const TaskStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: Target,
      color: 'var(--primary-color)',
      bgColor: 'rgba(102, 126, 234, 0.1)'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'var(--warning-color)',
      bgColor: 'rgba(237, 137, 54, 0.1)'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'var(--success-color)',
      bgColor: 'rgba(72, 187, 120, 0.1)'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'var(--danger-color)',
      bgColor: 'rgba(245, 101, 101, 0.1)'
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: TrendingUp,
      color: 'var(--danger-color)',
      bgColor: 'rgba(245, 101, 101, 0.1)'
    }
  ];

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.label} className="stat-card" style={{ '--delay': `${index * 0.1}s` }}>
              <div 
                className="stat-icon"
                style={{ 
                  backgroundColor: stat.bgColor,
                  color: stat.color 
                }}
              >
                <IconComponent size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {stats.total > 0 && (
        <div className="completion-card">
          <div className="completion-header">
            <h3>Progress Overview</h3>
            <span className="completion-rate">{completionRate}% Complete</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="completion-stats">
            <span>{stats.completed} of {stats.total} tasks completed</span>
            {stats.overdue > 0 && (
              <span className="overdue-warning">
                ⚠️ {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;
