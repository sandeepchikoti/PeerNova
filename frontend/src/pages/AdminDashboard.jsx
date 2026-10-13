import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  Star,
  FileText,
  Flag,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('profiles'); // 'profiles' | 'skills' | 'certificates_reviews'
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingVerifications: 0,
    approvedStudents: 0,
    rejectedStudents: 0,
  });

  const [students, setStudents] = useState([]);
  const [skillAttempts, setSkillAttempts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, studentsData, attemptsData, certsData, reviewsData] = await Promise.all([
        api.getAdminDashboardStats(),
        api.getAdminStudents(search, statusFilter),
        api.getAllTestAttemptsForAdmin().catch(() => []),
        api.getAllCertificatesForAdmin().catch(() => []),
        api.getAllReviewsForAdmin().catch(() => []),
      ]);
      setStats(statsData);
      setStudents(studentsData);
      setSkillAttempts(attemptsData || []);
      setCertificates(certsData || []);
      setReviews(reviewsData || []);
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

  const handleToggleFlagReview = async (reviewId, currentFlagged) => {
    try {
      await api.toggleFlagReview(reviewId, !currentFlagged);
      setActionMessage(`Review flag status updated to ${!currentFlagged ? 'FLAGGED' : 'ACTIVE'}`);
      fetchAdminData();
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      alert(`Error toggling review flag: ${err.message}`);
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
              Manage student identity verifications, review skill certifications, and oversee peer ratings & credentials.
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
            <div className="stat-number">{stats.pendingVerifications}</div>
            <div className="stat-label">Pending Profile Verifications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Award size={22} />
          </div>
          <div>
            <div className="stat-number">{certificates.length}</div>
            <div className="stat-label">Official Certificates Issued</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#facc15' }}>
            <Star size={22} />
          </div>
          <div>
            <div className="stat-number">{reviews.length}</div>
            <div className="stat-label">Peer Mentorship Reviews</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('profiles')}
          className="btn"
          style={{
            backgroundColor: activeTab === 'profiles' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'profiles' ? '#fff' : '#9ca3af',
            border: 'none',
            fontWeight: 700,
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <ShieldCheck size={16} /> Profile Verification ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className="btn"
          style={{
            backgroundColor: activeTab === 'skills' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'skills' ? '#fff' : '#9ca3af',
            border: 'none',
            fontWeight: 700,
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Award size={16} /> Skill Assessments ({skillAttempts.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates_reviews')}
          className="btn"
          style={{
            backgroundColor: activeTab === 'certificates_reviews' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'certificates_reviews' ? '#fff' : '#9ca3af',
            border: 'none',
            fontWeight: 700,
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <FileText size={16} /> Certificates & Reviews ({certificates.length} Certs, {reviews.length} Reviews)
        </button>
      </div>

      {/* Tab 1: Student Profiles */}
      {activeTab === 'profiles' ? (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="card-title">Student Profile Verifications</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Review student profile submissions and grant verified identity status</p>
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
                              title="Approve Profile"
                            >
                              <CheckCircle size={14} /> Approve
                            </button>
                          )}

                          {student.verificationStatus !== 'REJECTED' && (
                            <button
                              onClick={() => handleVerifyStatus(student.id, 'REJECTED')}
                              className="btn btn-danger btn-sm"
                              title="Reject Profile"
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
      ) : activeTab === 'skills' ? (
        /* Tab 2: Skill Assessments & Badges */
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Skill Assessment Attempts & Verified Badges</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                System-evaluated MCQ assessments and verified badge credentials across the platform.
              </p>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assessment Title</th>
                  <th>Skill Category</th>
                  <th>Score</th>
                  <th>Attempted Date</th>
                  <th>Status</th>
                  <th>Verified Badge</th>
                </tr>
              </thead>
              <tbody>
                {skillAttempts.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#9ca3af' }}>
                      No skill assessment attempts recorded yet.
                    </td>
                  </tr>
                ) : (
                  skillAttempts.map((att) => (
                    <tr key={att.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{att.studentName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{att.studentEmail}</div>
                      </td>
                      <td style={{ fontWeight: 600, color: '#e2e8f0' }}>{att.testTitle}</td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            fontWeight: 700,
                          }}
                        >
                          {att.skillName}
                        </span>
                      </td>
                      <td>
                        {(() => {
                          const isPassed = Boolean(att.passed ?? att.isPassed);
                          const pct = Number(att.scorePercentage ?? att.percentage ?? 0);
                          const sc = att.score ?? 0;
                          const total = att.totalQuestions ?? att.totalMarks ?? 5;
                          return (
                            <>
                              <span
                                style={{
                                  fontWeight: 800,
                                  color: isPassed ? '#34d399' : '#f87171',
                                  fontSize: '0.95rem',
                                }}
                              >
                                {pct.toFixed(1)}%
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '4px' }}>
                                ({sc}/{total})
                              </span>
                            </>
                          );
                        })()}
                      </td>
                      <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                        {new Date(att.attemptedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${Boolean(att.passed ?? att.isPassed) ? 'badge-verified' : 'badge-rejected'}`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {Boolean(att.passed ?? att.isPassed) ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td>
                        {Boolean(att.passed ?? att.isPassed) ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(16, 185, 129, 0.25)',
                              color: '#34d399',
                              border: '1px solid rgba(16, 185, 129, 0.5)',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                            }}
                          >
                            <ShieldCheck size={12} /> VERIFIED
                          </span>
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Not Granted</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 3: Certificates & Peer Reviews Oversight */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Certificates Issued Subpanel */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Issued Platform Certificates ({certificates.length})</h2>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Verifiable technical competency credentials and session completion certificates.
                </p>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Credential ID</th>
                    <th>Recipient</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Score / Status</th>
                    <th>Date Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                        No certificates generated yet.
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert) => (
                      <tr key={cert.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#fbbf24' }}>
                          {cert.certificateNumber}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{cert.recipientName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{cert.recipientEmail}</div>
                        </td>
                        <td>
                          <span
                            className="badge badge-verified"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {cert.certificateType}
                          </span>
                        </td>
                        <td style={{ color: '#e2e8f0', fontWeight: 600 }}>{cert.subjectName}</td>
                        <td>
                          {cert.score != null ? (
                            <span style={{ fontWeight: 800, color: '#34d399' }}>{cert.score.toFixed(1)}%</span>
                          ) : (
                            <span style={{ color: '#818cf8', fontWeight: 600 }}>Completed</span>
                          )}
                        </td>
                        <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Peer Reviews & Ratings Moderation Subpanel */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Peer Mentorship Reviews & Moderation ({reviews.length})</h2>
                <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Student ratings and qualitative reviews following completed collaborative study sessions.
                </p>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Mentor (Reviewee)</th>
                    <th>Topic</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Moderation</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                        No peer reviews submitted yet.
                      </td>
                    </tr>
                  ) : (
                    reviews.map((rev) => (
                      <tr key={rev.id}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{rev.reviewerName}</td>
                        <td style={{ fontWeight: 600, color: '#818cf8' }}>{rev.revieweeName}</td>
                        <td style={{ color: '#e2e8f0' }}>{rev.sessionTopic}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontWeight: 800 }}>
                            <Star size={14} fill="#fbbf24" /> {rev.rating} / 5
                          </div>
                        </td>
                        <td style={{ color: '#cbd5e1', fontSize: '0.85rem', maxWidth: '240px' }}>
                          {rev.comment || 'No written comment'}
                        </td>
                        <td>
                          <span
                            className={`badge ${rev.isFlagged ? 'badge-rejected' : 'badge-verified'}`}
                            style={{ fontSize: '0.7rem' }}
                          >
                            {rev.isFlagged ? 'FLAGGED' : 'ACTIVE'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleFlagReview(rev.id, rev.isFlagged)}
                            className="btn btn-outline btn-sm"
                            style={{
                              fontSize: '0.72rem',
                              color: rev.isFlagged ? '#34d399' : '#f87171',
                              borderColor: rev.isFlagged ? '#10b981' : '#ef4444',
                            }}
                          >
                            <Flag size={12} /> {rev.isFlagged ? 'Unflag Review' : 'Flag Inappropriate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            className="card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="card-header">
              <h3 className="card-title">Student Profile Review</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Full Name</div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{selectedStudent.fullName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Email Address</div>
                  <div style={{ color: '#e2e8f0' }}>{selectedStudent.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>College / University</div>
                  <div style={{ color: '#e2e8f0' }}>{selectedStudent.college || 'Not specified'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Department</div>
                  <div style={{ color: '#e2e8f0' }}>{selectedStudent.department || 'Not specified'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Year of Study</div>
                  <div style={{ color: '#e2e8f0' }}>Year {selectedStudent.yearOfStudy || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Profile Status</div>
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
