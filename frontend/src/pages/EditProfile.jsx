import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import { Save, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const EditProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    college: '',
    department: '',
    yearOfStudy: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await api.getStudentProfile();
        setFormData({
          fullName: profile.fullName || '',
          college: profile.college || '',
          department: profile.department || '',
          yearOfStudy: profile.yearOfStudy || '3rd Year',
          bio: profile.bio || '',
        });
      } catch (err) {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      await api.updateStudentProfile(formData);
      await refreshUser();
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Loading profile editor...</div>;
  }

  return (
    <div style={{ maxWidth: '640px', margin: '1.5rem auto 0' }} className="animate-fade-in">
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/student/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#9ca3af' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Edit Student Profile</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Update your college background and bio to help peers discover you.
          </p>
        </div>

        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <div>{success}</div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">College / University</label>
              <input
                type="text"
                name="college"
                className="form-input"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department / Branch</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Year of Study</label>
            <select
              name="yearOfStudy"
              className="form-select"
              value={formData.yearOfStudy}
              onChange={handleChange}
            >
              <option value="1st Year">1st Year B.Tech</option>
              <option value="2nd Year">2nd Year B.Tech</option>
              <option value="3rd Year">3rd Year B.Tech</option>
              <option value="4th Year">4th Year B.Tech</option>
              <option value="Postgraduate">M.Tech / MCA</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bio / Academic Summary</label>
            <textarea
              name="bio"
              className="form-textarea"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Describe your technical interests, coding journey, or what you hope to achieve on PeerNova..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Link to="/student/dashboard" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
