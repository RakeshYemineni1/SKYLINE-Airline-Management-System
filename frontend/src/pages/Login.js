import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuth } from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

function Login() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(formData);
      setAuth(response.data.token, response.data.user);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const pageStyle = {
    minHeight: '100vh',
    background: colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    padding: '40px',
    width: '100%',
    maxWidth: '400px'
  };

  const inputStyle = {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    color: colors.text
  };

  const buttonStyle = {
    background: colors.primary,
    color: colors.background,
    width: '100%'
  };

  return (
    <div style={pageStyle}>
      <div className="card" style={cardStyle}>
        
        {/* Header */}
        <div className="text-center mb-20">
          <h1 style={{ color: colors.primary, fontSize: '32px', marginBottom: '10px' }}>
            LOGIN
          </h1>
          <p style={{ color: colors.textSecondary }}>Access your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error" style={{ 
              background: colors.surface, 
              color: colors.error, 
              border: `1px solid ${colors.error}`,
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label style={{ color: colors.text }}>EMAIL</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ color: colors.text }}>PASSWORD</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={inputStyle}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ 
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-20" style={{ paddingTop: '20px', borderTop: `1px solid ${colors.border}` }}>
          <p style={{ color: colors.textSecondary, marginBottom: '10px' }}>
            Don't have an account?
          </p>
          <Link 
            to="/register" 
            style={{ 
              color: colors.primary, 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;