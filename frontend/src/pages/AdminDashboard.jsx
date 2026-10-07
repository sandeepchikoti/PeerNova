import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { ShieldCheck, ShieldAlert, Users, Search, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingVerifications: 0,
    approvedStudents: 0,
    rejectedStudents: 0,
  });

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, studentsData] = await Promise.all([
        api.getAdminDashboardStats(),
        api.getAdminStudents(search, statusFilter),
      ]);
      setStats(statsData);
      setStudents(studentsData);
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleVerifyStatus = async (studentId, newStatus) => {
    try {
      await api.verifyStudentProfile(studentId, newStatus);
      setActionMessage(`Successfully updated student verification status to ${newStatus}`);
      if (selectedStudent?.id === studentId) {
        setSelectedStudent((prev) => ({ ...prev, verificationStatus: newStatus }));
      }
      fetchAdminData();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert(`Error verifying profile: ${err.message}`);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderColor: '#334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <ShieldCheck size={26} style={{ color: '#6366f1' }} />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Administrator Management Portal</h1>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
              Verify student profiles, review identity credentials, and manage platform ecosystem compliance.
            </p>
          </div>

          <button onClick={fetchAdminData} className="btn btn-outline btn-sm">
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <div>{actionMessage}</div>
        </div>
      )}

      {/* Admin Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-number">{stats.totalStudents}</div>
            <div className="stat-label">Total Registered Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div className="stat-number" style={{ color: '#f59e0b' }}>{stats.pendingVerifications}</div>
            <div className="stat-label">Pending Verification Requests</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="stat-number" style={{ color: '#10b981' }}>{stats.approvedStudents}</div>
            <div className="stat-label">Verified Student Profiles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div className="stat-number" style={{ color: '#ef4444' }}>{stats.rejectedStudents}</div>
            <div className="stat-label">Rejected Profiles</div>
          </div>
        </div>
      </div>

      {/* Student List Section */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="card-title">Student Profile Verifications</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Review student profile submissions and grant verified status</p>
          </div>

          {/* Search & Filter Toolbar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search name, college, dept..."
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.875rem', width: '220px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-outline btn-sm">
                <Search size={14} />
              </button>
            </form>

            <select
              className="form-select"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.875rem', width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Verification</option>
              <option value="VERIFIED">Verified / Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>College / Department</th>
                <th>Year</th>
                <th>Verification Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    Loading student list...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                    No student profiles match your search criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{student.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{student.email}</div>
                    </td>
                    <td>
                      <div style={{ color: '#e2e8f0' }}>{student.college || 'N/A'}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{student.department}</div>
                    </td>
                    <td>{student.yearOfStudy}</td>
                    <td>
                      <span className={`badge ${student.verificationStatus === 'VERIFIED' || student.verificationStatus === 'APPROVED' ? 'badge-verified' : student.verificationStatus === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>
                        {student.verificationStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="btn btn-outline btn-sm"
                          title="View Details"
                        >
                          <Eye size={14} /> Detail
                        </button>

                        {student.verificationStatus !== 'VERIFIED' && student.verificationStatus !== 'APPROVED' && (
                          <button
                            onClick={() => handleVerifyStatus(student.id, 'VERIFIED')}
                            className="btn btn-success btn-sm"
                            title="Approve Verification"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}

                        {student.verificationStatus !== 'REJECTED' && (
                          <button
                            onClick={() => handleVerifyStatus(student.id, 'REJECTED')}
                            className="btn btn-danger btn-sm"
                            title="Reject Verification"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Student Detail Review Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <h3 className="card-title">Student Profile Details</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="form-label" style={{ color: '#9ca3af' }}>Full Name</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{selectedStudent.fullName}</div>
              </div>

              <div>
                <label className="form-label" style={{ color: '#9ca3af' }}>Email</label>
                <div style={{ color: '#e2e8f0' }}>{selectedStudent.email}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ color: '#9ca3af' }}>College</label>
                  <div style={{ color: '#e2e8f0' }}>{selectedStudent.college || 'N/A'}</div>
                </div>
                <div>
                  <label className="form-label" style={{ color: '#9ca3af' }}>Department</label>
                  <div style={{ color: '#e2e8f0' }}>{selectedStudent.department}</div>
                </div>
              </div>

              <div>
                <label className="form-label" style={{ color: '#9ca3af' }}>Year of Study</label>
                <div style={{ color: '#e2e8f0' }}>{selectedStudent.yearOfStudy}</div>
              </div>

              <div>
                <label className="form-label" style={{ color: '#9ca3af' }}>Bio / Summary</label>
                <div style={{ color: '#cbd5e1', fontSize: '0.9rem', backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  {selectedStudent.bio || 'No bio submitted.'}
                </div>
              </div>

              <div>
                <label className="form-label" style={{ color: '#9ca3af' }}>Current Status</label>
                <div>
                  <span className={`badge ${selectedStudent.verificationStatus === 'VERIFIED' || selectedStudent.verificationStatus === 'APPROVED' ? 'badge-verified' : selectedStudent.verificationStatus === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>
                    {selectedStudent.verificationStatus}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                onClick={() => handleVerifyStatus(selectedStudent.id, 'REJECTED')}
                className="btn btn-danger btn-sm"
              >
                Reject Profile
              </button>
              <button
                onClick={() => handleVerifyStatus(selectedStudent.id, 'VERIFIED')}
                className="btn btn-success btn-sm"
              >
                Approve Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
