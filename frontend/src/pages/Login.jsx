import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import api, { setAuthToken } from '../lib/axios';

function Login() {
  const { isAuthenticated, loading, login, isManager } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(isManager ? '/manager' : '/', { replace: true });
    }
  }, [loading, isAuthenticated, isManager, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="text-[15px]" style={{ color: 'var(--color-muted)' }}>Loading…</p>
      </div>
    );
  }

  if (isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!email.trim() || !password) {
      setError('Email and password are required.');
      setSubmitting(false);
      return;
    }

    const {data: {token}} = await api.post('http://localhost:3000/api/auth/login', { email, password });

    setAuthToken(token);

    const {data} = await api.get('http://localhost:3000/api/auth/me');
    

    // TODO: Replace with real API call when backend is ready
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.message || 'Login failed');
    // login(data.user, data.token);

    // Mock login for now
    await new Promise((r) => setTimeout(r, 400));

    login(
      data,
      token,
    );

    setSubmitting(false);
    navigate(data.role === 'manager' ? '/manager' : '/');
  };

  const inputClass =
    'w-full px-3 py-2.5 text-[15px] border rounded-md bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)] transition-colors';
  const labelClass = 'block text-[13px] font-medium mb-1.5';

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-[400px] p-8 rounded-lg border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h1
          className="text-2xl text-center"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          CodeRelay
        </h1>
        <p className="text-center text-[14px] mt-1" style={{ color: 'var(--color-muted)' }}>
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div
              className="p-3 rounded text-[14px]"
              style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className={labelClass} style={{ color: 'var(--color-text)' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={{ borderColor: 'var(--color-border)' }}
              placeholder="you@company.com"
              autoComplete="email"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass} style={{ color: 'var(--color-text)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              style={{ borderColor: 'var(--color-border)' }}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>
         <button
            type="submit"
            className="w-full py-2.5 text-[15px] font-medium rounded-md transition-colors disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px]" style={{ color: 'var(--color-muted)' }}>
          Backend not connected yet. Use any email & password to sign in.
        </p>
      </div>
    </div>
  );
}

export default Login;
