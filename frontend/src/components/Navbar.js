import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, isCustomer, clearAuth, getUser } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const navStyle = {
    background: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    color: colors.text
  };

  const linkStyle = {
    color: colors.text,
    border: `1px solid transparent`
  };

  const linkHoverStyle = {
    color: colors.primary,
    borderColor: colors.primary
  };

  const themeToggleStyle = {
    background: isDark ? colors.primary : colors.border,
    position: 'relative'
  };

  const themeToggleAfterStyle = {
    background: colors.background,
    transform: isDark ? 'translateX(18px)' : 'translateX(0)'
  };

  return (
    <div className="navbar" style={navStyle}>
      <div className="navbar-content">
        <h1 style={{ color: colors.primary }}>SKYLINE</h1>
        
        <div className="navbar-links">
          <Link to="/" style={linkStyle} onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}>
            HOME
          </Link>
          
          {!isAuthenticated() && (
            <>
              <Link to="/login" style={linkStyle} onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}>
                LOGIN
              </Link>
              <Link to="/register" style={linkStyle} onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}>
                REGISTER
              </Link>
              <Link to="/admin/login" style={{ ...linkStyle, color: colors.primary, fontWeight: 'bold' }}>
                ADMIN
              </Link>
            </>
          )}
          
          {isAuthenticated() && (
            <>
              <Link to="/profile" style={linkStyle} onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}>
                PROFILE
              </Link>
            </>
          )}
          
          {isCustomer() && (
            <>
              <Link to="/my-bookings" style={linkStyle} onMouseOver={(e) => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={(e) => Object.assign(e.target.style, linkStyle)}>
                BOOKINGS
              </Link>
            </>
          )}
          
          {isAdmin() && (
            <>
              <Link to="/admin/dashboard" style={{ ...linkStyle, color: colors.primary, fontWeight: 'bold' }}>
                DASHBOARD
              </Link>
            </>
          )}
          
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            style={themeToggleStyle}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div style={{ ...themeToggleAfterStyle, position: 'absolute', width: '16px', height: '16px', borderRadius: '50%', top: '2px', left: '2px', transition: 'all 0.3s ease' }}></div>
          </button>
          
          {isAuthenticated() && (
            <>
              <span style={{ color: colors.textSecondary, fontSize: '12px' }}>
                {user?.firstName}
              </span>
              <button 
                onClick={handleLogout}
                style={{ 
                  ...linkStyle, 
                  background: colors.error, 
                  color: colors.background,
                  border: 'none',
                  padding: '8px 16px'
                }}
              >
                LOGOUT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;