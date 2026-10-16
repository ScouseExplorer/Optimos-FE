import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, getErrorMessage } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Enter both username/email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({
        username: formData.username.trim(),
        password: formData.password,
      });
      navigate('/dashboard');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <h1 id="login-title">Welcome back</h1>
        <p>Log in with your username or email to continue.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username or email</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="alex@company.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footnote">
          New to Optimos? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}