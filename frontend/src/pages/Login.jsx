import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield, UserCheck, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [roleTab, setRoleTab] = useState('STUDENT'); // 'STUDENT' or 'ADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = (type) => {
    setError('');
    if (type === 'ADMIN') {
      setRoleTab('ADMIN');
      setEmail('admin@peernova.edu');
      setPassword('Admin@123');
    } else {
      setRoleTab('STUDENT');
      setEmail('rithvik.reddy@malla-reddy.edu');
      setPassword('Student@123');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto 0' }} className="animate-fade-in">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 0.75rem', width: 48, height: 48, fontSize: '1.25rem' }}>
            PN
          </div>
          <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Sign In to PeerNova</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Select your account role to proceed
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setRoleTab('STUDENT')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: roleTab === 'STUDENT' ? 'var(--bg-card)' : 'transparent',
              color: roleTab === 'STUDENT' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)'
            }}
          >
            <UserCheck size={16} /> Student
          </button>
          <button
            type="button"
            onClick={() => setRoleTab('ADMIN')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: roleTab === 'ADMIN' ? 'var(--bg-card)' : 'transparent',
              color: roleTab === 'ADMIN' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)'
            }}
          >
            <Shield size={16} /> Admin
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder={roleTab === 'ADMIN' ? 'admin@peernova.edu' : 'student@college.edu'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : `Login as ${roleTab === 'ADMIN' ? 'Admin' : 'Student'}`}
          </button>
        </form>

        {/* Viva Quick Preset Credentials */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-color)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>Viva Demo Presets:</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fillDemoCredentials('STUDENT')}
            >
              Demo Student
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fillDemoCredentials('ADMIN')}
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#9ca3af' }}>
          Don't have a student account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};
