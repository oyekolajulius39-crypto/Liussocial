import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

const API_BASE = 'http://localhost:5000/api';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const response = await axios.post(`${API_BASE}${endpoint}`, formData);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg"></div>
      <div className="login-card">
        <div className="login-header">
          <div className="logo-large">
            <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
              <path d="M8 4H12V24H22V28H8V4Z" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="8" y1="4" x2="22" y2="28">
                  <stop offset="0%" stopColor="#7F3FBF" />
                  <stop offset="100%" stopColor="#9B59B6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Luna</h1>
          <p>{isRegister ? 'Create your account' : 'Welcome back'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Loading...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="link-btn"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className="demo-info">
          <p><strong>Demo accounts:</strong></p>
          <p>Email: emma@example.com | Password: password123</p>
          <p>Email: alex@example.com | Password: password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
