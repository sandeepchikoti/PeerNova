import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import { UserCheck, BookOpen, Users, ShieldAlert, ShieldCheck, Edit3, ArrowRight, Building, Award, Mail } from 'lucide-react';

export const StudentDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileData, summaryData] = await Promise.all([
          api.getStudentProfile(),
          api.getStudentDashboardSummary(),
        ]);
        setProfile(profileData);
        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
        Loading dashboard profile data...
      </div>
    );
  }

  const isVerified = profile?.verificationStatus === 'VERIFIED' || profile?.verificationStatus === 'APPROVED';
  const isRejected = profile?.verificationStatus === 'REJECTED';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e1b4b, #111827)', borderColor: '#3730a3', padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                Welcome back, {profile?.fullName || user?.fullName}!
              </h1>
              <span className={`badge ${isVerified ? 'badge-verified' : isRejected ? 'badge-rejected' : 'badge-pending'}`}>
                {profile?.verificationStatus || 'PENDING'}
              </span>
            </div>
            <p style={{ color: '#c7d2fe', fontSize: '0.95rem' }}>
              {profile?.college} • {profile?.department} ({profile?.yearOfStudy})
            </p>
          </div>

          <Link to="/student/profile/edit" className="btn btn-primary">
            <Edit3 size={16} /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Verification Status Alert Notification */}
      {!isVerified && !isRejected && (
        <div className="alert alert-warning">
          <ShieldAlert size={22} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' }}>Profile Verification Pending</strong>
            Your student account is currently pending administrative verification. Once reviewed and approved by the college administrator, your profile will display the verified student badge to potential peer matches.
          </div>
        </div>
      )}

      {isVerified && (
        <div className="alert alert-success">
          <ShieldCheck size={22} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' }}>Account Verified by Admin</strong>
            Your student identity has been verified. You can now engage in skill exchanges, connect with peers, and schedule collaborative learning sessions.
          </div>
        </div>
      )}

      {isRejected && (
        <div className="alert alert-danger">
          <ShieldAlert size={22} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' }}>Profile Review Needs Update</strong>
            Your profile details were not approved during the initial admin review. Please update your college and department information in Edit Profile for re-evaluation.
          </div>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div className="stat-number">{summary?.teachingSkillsCount || 0}</div>
            <div className="stat-label">Teaching Skills (Phase 2)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div className="stat-number">{summary?.learningSkillsCount || 0}</div>
            <div className="stat-label">Learning Skills (Phase 2)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-number">{summary?.activeConnectionsCount || 0}</div>
            <div className="stat-label">Peer Connections (Phase 3)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: isVerified ? '#34d399' : '#fbbf24' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div className="stat-number" style={{ fontSize: '1.25rem' }}>{profile?.verificationStatus}</div>
            <div className="stat-label">Account Verification</div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Feature Highlight Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.15))',
          borderColor: 'rgba(168, 85, 247, 0.35)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.5rem 1.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '999px', backgroundColor: 'rgba(168, 85, 247, 0.3)', color: '#e879f9' }}>
              PHASE 4 ACTIVE
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              AI/ML Personalized Peer Recommendations
            </h3>
          </div>
          <p style={{ color: '#d8b4fe', fontSize: '0.875rem' }}>
            Discover tailored peer recommendations computed via Python Cosine Similarity, KNN, and K-Means Clustering.
          </p>
        </div>

        <Link to="/student/recommendations" className="btn btn-primary" style={{ backgroundColor: '#a855f7', borderColor: '#a855f7' }}>
          Explore AI Matches <ArrowRight size={16} />
        </Link>
      </div>

      {/* Main Student Profile Summary Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Student Academic Profile</h2>
          <span className="badge badge-pending">Phase 1 Complete</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <label className="form-label" style={{ color: '#9ca3af' }}>Full Name</label>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>{profile?.fullName}</div>
          </div>

          <div>
            <label className="form-label" style={{ color: '#9ca3af' }}>Email Address</label>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={16} style={{ color: '#6366f1' }} /> {profile?.email}
            </div>
          </div>

          <div>
            <label className="form-label" style={{ color: '#9ca3af' }}>College / University</label>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Building size={16} style={{ color: '#0ea5e9' }} /> {profile?.college || 'Not specified'}
            </div>
          </div>

          <div>
            <label className="form-label" style={{ color: '#9ca3af' }}>Department & Year</label>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={16} style={{ color: '#10b981' }} /> {profile?.department} ({profile?.yearOfStudy})
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <label className="form-label" style={{ color: '#9ca3af' }}>About / Bio</label>
          <p style={{ color: '#e2e8f0', lineHeight: 1.6 }}>
            {profile?.bio || 'No bio provided yet. Click "Edit Profile" to add your interests and background.'}
          </p>
        </div>
      </div>
    </div>
  );
};
