import React, { useState } from 'react';
import { login, register } from './api';
import './AuthForm.css';

export default function AuthForm({ setToken, setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const res = await login(name, password);
        if (res.token && res.user) {
          setToken(res.token, res.user);
        } else {
          setError('Invalid login credentials');
        }
      } else {
        const res = await register(name, password, email);
        if (res.message === 'User registered') {
          setIsLogin(true);
          setError('Registration successful! Please login.');
          setPassword('');
        } else {
          setError(res.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="auth-input"
          />
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <div className="auth-switch">
          {isLogin ? (
            <>
              <span>Don't have an account?</span>
              <button className="link-btn" onClick={() => { setIsLogin(false); setError(''); }}>Register</button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button className="link-btn" onClick={() => { setIsLogin(true); setError(''); }}>Login</button>
            </>
          )}
        </div>
        {error && <div className="auth-error">{error}</div>}
      </div>
    </div>
  );
}
