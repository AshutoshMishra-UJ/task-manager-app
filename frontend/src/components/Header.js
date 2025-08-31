import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, User, Moon, Sun, CheckSquare } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <CheckSquare size={28} />
            Task Manager Pro
          </Link>
          
          <nav className="nav-links">
            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} />
                  <span>{user.username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="btn-icon"
                  style={{ color: 'white' }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                {location.pathname !== '/login' && (
                  <Link to="/login">Login</Link>
                )}
                {location.pathname !== '/register' && (
                  <Link to="/register">Register</Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
