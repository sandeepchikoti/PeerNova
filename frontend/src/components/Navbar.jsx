import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, ShieldCheck, Compass, LayoutDashboard, Sparkles, Users, Zap, Brain, MessageSquare } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isStudent, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">PN</div>
          <span>PeerNova</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>

          {isAuthenticated && isStudent && (
            <>
              <Link
                to="/student/dashboard"
                className={`nav-link ${isActive('/student/dashboard') ? 'active' : ''}`}
              >
                <LayoutDashboard size={15} style={{ marginRight: 4 }} />
                Dashboard
              </Link>

              <Link
                to="/student/chat"
                className={`nav-link ${isActive('/student/chat') ? 'active' : ''}`}
              >
                <MessageSquare size={15} style={{ marginRight: 4, color: '#38bdf8' }} />
                Chat
              </Link>

              <Link
                to="/student/recommendations"
                className={`nav-link ${isActive('/student/recommendations') ? 'active' : ''}`}
              >
                <Brain size={15} style={{ marginRight: 4, color: '#e879f9' }} />
                AI Recommendations
              </Link>

              <Link
                to="/student/matching"
                className={`nav-link ${isActive('/student/matching') ? 'active' : ''}`}
              >
                <Zap size={15} style={{ marginRight: 4, color: '#818cf8' }} />
                Skill Matches
              </Link>

              <Link
                to="/discover"
                className={`nav-link ${isActive('/discover') ? 'active' : ''}`}
              >
                <Compass size={15} style={{ marginRight: 4 }} />
                Discover
              </Link>

              <Link
                to="/student/connections"
                className={`nav-link ${isActive('/student/connections') ? 'active' : ''}`}
              >
                <Users size={15} style={{ marginRight: 4 }} />
                Connections
              </Link>

              <Link
                to="/student/skills"
                className={`nav-link ${isActive('/student/skills') ? 'active' : ''}`}
              >
                <Sparkles size={15} style={{ marginRight: 4 }} />
                My Skills
              </Link>

              <Link
                to="/student/profile"
                className={`nav-link ${isActive('/student/profile') ? 'active' : ''}`}
              >
                <User size={15} style={{ marginRight: 4 }} />
                My Profile
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
            >
              <ShieldCheck size={15} style={{ marginRight: 4 }} />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          {isAuthenticated ? (
            <>
              <span
                className={`badge ${
                  isAdmin
                    ? 'badge-verified'
                    : user?.verificationStatus === 'VERIFIED' || user?.verificationStatus === 'APPROVED'
                    ? 'badge-verified'
                    : user?.verificationStatus === 'REJECTED'
                    ? 'badge-rejected'
                    : 'badge-pending'
                }`}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
              >
                {isAdmin ? 'ADMIN' : user?.verificationStatus || 'PENDING'}
              </span>

              <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {user?.fullName}
              </span>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                title="Log Out"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ fontSize: '0.8rem' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
