import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { ScheduleSessionModal } from '../components/ScheduleSessionModal';
import { VideoMeetingModal } from '../components/VideoMeetingModal';
import {
  Video,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  Users,
  Award,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('CONFIRMED'); // 'CONFIRMED', 'REQUESTED', 'COMPLETED', 'ATTENDANCE'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Modals state
  const [activeMeetingSession, setActiveMeetingSession] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [connectedPeers, setConnectedPeers] = useState([]);
  const [selectedPeerForSchedule, setSelectedPeerForSchedule] = useState(null);

  const fetchSessionsData = async () => {
    setLoading(true);
    try {
      const [sessData, attData, peers] = await Promise.all([
        api.getMySessions(),
        api.getMyAttendanceHistory(),
        api.getActiveConnections().catch(() => []),
      ]);
      setSessions(sessData || []);
      setAttendanceHistory(attData || []);
      setConnectedPeers(peers || []);
    } catch (err) {
      console.error('Failed to load session data:', err);
      setError(err.message || 'Failed to load learning sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionsData();
  }, []);

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      await api.updateSessionStatus(sessionId, status);
      setMessage(`Session ${status.toLowerCase()} successfully!`);
      setTimeout(() => setMessage(''), 3500);
      fetchSessionsData();
    } catch (err) {
      alert(`Error updating session status: ${err.message}`);
    }
  };

  const handleOpenScheduleWithPeer = (peer) => {
    setSelectedPeerForSchedule(peer);
    setIsScheduleOpen(true);
  };

  const handleOpenQuickSchedule = () => {
    if (connectedPeers.length === 0) {
      alert('You have no active peer connections yet. Connect with a peer first from the Connections or Discover page!');
      return;
    }
    // Default to the first peer in active connections
    const firstPeer = {
      profileId: connectedPeers[0].peerProfileId,
      fullName: connectedPeers[0].peerName,
      college: connectedPeers[0].peerCollege,
      department: connectedPeers[0].peerDepartment,
      teachingSkills: [],
      learningSkills: []
    };
    setSelectedPeerForSchedule(firstPeer);
    setIsScheduleOpen(true);
  };

  // Filter sessions by tab
  const confirmedSessions = sessions.filter((s) => s.status === 'CONFIRMED');
  const requestedSessions = sessions.filter((s) => s.status === 'REQUESTED');
  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED' || s.status === 'CANCELLED' || s.status === 'REJECTED');

  const formatDateTime = (dtStr) => {
    if (!dtStr) return 'TBD';
    const date = new Date(dtStr);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #091224, #131d36)',
          borderColor: '#1e2d4d',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                <Video size={24} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Collaborative Learning Sessions & Attendance
              </h1>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.925rem', margin: 0 }}>
              Schedule peer study sessions, join live interactive video rooms, and track verified learning attendance.
            </p>
          </div>

          <button
            onClick={handleOpenQuickSchedule}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)' }}
          >
            <PlusCircle size={18} />
            <span>Schedule New Session</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card stat-card" style={{ padding: '1.25rem' }}>
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value" style={{ color: '#60a5fa' }}>{sessions.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Requested & booked</div>
        </div>

        <div className="card stat-card" style={{ padding: '1.25rem' }}>
          <div className="stat-label">Upcoming & Confirmed</div>
          <div className="stat-value" style={{ color: '#34d399' }}>{confirmedSessions.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Ready for video meetings</div>
        </div>

        <div className="card stat-card" style={{ padding: '1.25rem' }}>
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{requestedSessions.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Awaiting peer confirmation</div>
        </div>

        <div className="card stat-card" style={{ padding: '1.25rem' }}>
          <div className="stat-label">Verified Attendances</div>
          <div className="stat-value" style={{ color: '#a78bfa' }}>{attendanceHistory.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Completed learning joins</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', gap: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('CONFIRMED')}
          className={`nav-link ${activeTab === 'CONFIRMED' ? 'active' : ''}`}
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', cursor: 'pointer', background: 'transparent', border: 'none' }}
        >
          <Video size={16} style={{ display: 'inline', marginRight: 6 }} />
          Upcoming & Confirmed ({confirmedSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('REQUESTED')}
          className={`nav-link ${activeTab === 'REQUESTED' ? 'active' : ''}`}
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', cursor: 'pointer', background: 'transparent', border: 'none' }}
        >
          <Calendar size={16} style={{ display: 'inline', marginRight: 6 }} />
          Pending Requests ({requestedSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`nav-link ${activeTab === 'COMPLETED' ? 'active' : ''}`}
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', cursor: 'pointer', background: 'transparent', border: 'none' }}
        >
          <Clock size={16} style={{ display: 'inline', marginRight: 6 }} />
          Session History ({completedSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`nav-link ${activeTab === 'ATTENDANCE' ? 'active' : ''}`}
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', cursor: 'pointer', background: 'transparent', border: 'none' }}
        >
          <Award size={16} style={{ display: 'inline', marginRight: 6 }} />
          Attendance Records ({attendanceHistory.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Loading collaborative learning sessions...
        </div>
      ) : activeTab === 'ATTENDANCE' ? (
        /* Attendance History View */
        <div className="card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: '#10b981' }} />
            Your Verified Learning Attendance Records
          </h2>

          {attendanceHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
              No attendance records logged yet. Join a video meeting room to record your attendance!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '0.75rem' }}>Record #</th>
                    <th style={{ padding: '0.75rem' }}>Session ID</th>
                    <th style={{ padding: '0.75rem' }}>Student Name</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Joined Timestamp</th>
                    <th style={{ padding: '0.75rem' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((rec) => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid #131b2e' }}>
                      <td style={{ padding: '0.75rem', color: '#64748b' }}>#{rec.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: '#818cf8' }}>Session #{rec.sessionId}</td>
                      <td style={{ padding: '0.75rem', color: '#e2e8f0' }}>{rec.studentName}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                          ✓ {rec.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{formatDateTime(rec.joinedAt)}</td>
                      <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>{rec.remarks || 'Standard video meeting join'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Sessions List (Confirmed, Requested, or Completed) */
        <div>
          {(() => {
            const list =
              activeTab === 'CONFIRMED'
                ? confirmedSessions
                : activeTab === 'REQUESTED'
                ? requestedSessions
                : completedSessions;

            if (list.length === 0) {
              return (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                  <Calendar size={44} style={{ color: '#475569', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                    No {activeTab.toLowerCase()} sessions found
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                    {activeTab === 'CONFIRMED'
                      ? 'You have no confirmed upcoming sessions right now. Request a new study session with your connected peers.'
                      : activeTab === 'REQUESTED'
                      ? 'No pending session requests waiting for approval.'
                      : 'You have not completed any sessions yet.'}
                  </p>
                  <button onClick={handleOpenQuickSchedule} className="btn btn-primary btn-sm">
                    Schedule a Study Session
                  </button>
                </div>
              );
            }

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
                {list.map((sess) => {
                  const isMentor = sess.currentUserRole === 'MENTOR';
                  const peerName = isMentor ? sess.learnerName : sess.mentorName;
                  const peerCollege = isMentor ? sess.learnerCollege : sess.mentorCollege;

                  return (
                    <div
                      key={sess.id}
                      className="card"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        borderLeft: sess.status === 'CONFIRMED' ? '4px solid #10b981' : sess.status === 'REQUESTED' ? '4px solid #f59e0b' : '4px solid #64748b',
                        background: 'linear-gradient(180deg, #0d1527, #090e1a)',
                      }}
                    >
                      {/* Top Header */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <span className={`badge ${sess.status === 'CONFIRMED' ? 'badge-verified' : sess.status === 'REQUESTED' ? 'badge-pending' : 'badge-rejected'}`} style={{ fontSize: '0.725rem' }}>
                            {sess.status}
                          </span>
                          <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                            {isMentor ? '🎓 You are Teaching' : '💡 You are Learning'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                          {sess.skillTopic}
                        </h3>

                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.85rem' }}>
                          {sess.description || 'No description provided.'}
                        </p>

                        {/* Timing & Peer Grid */}
                        <div style={{ background: '#0b1120', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#cbd5e1' }}>
                            <Calendar size={15} style={{ color: '#818cf8' }} />
                            <span>{formatDateTime(sess.scheduledAt)}</span>
                            <span style={{ color: '#64748b' }}>({sess.durationMinutes} mins)</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#94a3b8' }}>
                            <Users size={15} style={{ color: '#10b981' }} />
                            <span>Peer: <strong style={{ color: '#f1f5f9' }}>{peerName}</strong> ({peerCollege})</span>
                          </div>
                        </div>

                        {/* Attendance status badge */}
                        {sess.attendedByCurrentUser && (
                          <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                            <CheckCircle size={14} />
                            <span>Your attendance is recorded as Present</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid #1e293b' }}>
                        {sess.status === 'CONFIRMED' && (
                          <>
                            <button
                              onClick={() => setActiveMeetingSession(sess)}
                              className="btn btn-primary btn-sm"
                              style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem',
                                background: 'linear-gradient(135deg, #059669, #10b981)',
                                borderColor: '#059669',
                              }}
                            >
                              <Video size={16} />
                              <span>Join Live Video Room</span>
                            </button>

                            <button
                              onClick={() => handleStatusUpdate(sess.id, 'COMPLETED')}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              title="Mark session as completed after meeting"
                            >
                              Complete
                            </button>
                          </>
                        )}

                        {sess.status === 'REQUESTED' && (
                          <>
                            {/* If current user is learner and peer requested, or current user is mentor and peer requested */}
                            <button
                              onClick={() => handleStatusUpdate(sess.id, 'CONFIRMED')}
                              className="btn btn-primary btn-sm"
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                            >
                              <CheckCircle size={15} /> Confirm Session
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(sess.id, 'REJECTED')}
                              className="btn btn-outline btn-sm"
                              style={{ color: '#f87171' }}
                            >
                              <XCircle size={15} /> Decline
                            </button>
                          </>
                        )}

                        {sess.status === 'COMPLETED' && (
                          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <CheckCircle size={14} style={{ color: '#10b981' }} />
                            <span>Session archived & verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Video Meeting Modal */}
      {activeMeetingSession && (
        <VideoMeetingModal
          isOpen={!!activeMeetingSession}
          onClose={() => {
            setActiveMeetingSession(null);
            fetchSessionsData();
          }}
          session={activeMeetingSession}
          onAttendanceRecorded={fetchSessionsData}
        />
      )}

      {/* Schedule Session Modal */}
      {isScheduleOpen && (
        <ScheduleSessionModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setSelectedPeerForSchedule(null);
          }}
          peer={selectedPeerForSchedule}
          onSuccess={() => {
            setMessage('Learning session requested! Awaiting peer confirmation.');
            fetchSessionsData();
          }}
        />
      )}
    </div>
  );
};
