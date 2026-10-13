import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { X, Video, ExternalLink, CheckCircle, Clock, ShieldCheck, Users, PhoneOff } from 'lucide-react';

export const VideoMeetingModal = ({ isOpen, onClose, session, onAttendanceRecorded }) => {
  const { user } = useAuth();
  const [attendanceLogged, setAttendanceLogged] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen || !session) return;

    // Reset elapsed timer
    setElapsedSeconds(0);
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Auto mark attendance on entering video room
    const recordAttendance = async () => {
      try {
        await api.markSessionAttendance(session.id, {
          status: 'PRESENT',
          remarks: `Attended video room as ${session.currentUserRole || 'PARTICIPANT'}`,
        });
        setAttendanceLogged(true);
        if (onAttendanceRecorded) onAttendanceRecorded();
      } catch (err) {
        console.error('Failed to log session attendance:', err);
      }
    };

    recordAttendance();

    return () => clearInterval(timer);
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const displayName = user?.fullName || 'PeerNova Student';
  // Build safe Jitsi URL with pre-filled display name
  const jitsiUrl = `https://meet.jit.si/${session.meetingRoomId}#userInfo.displayName="${encodeURIComponent(displayName)}"`;

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 9999, padding: '1rem' }}>
      <div
        className="animate-fade-in"
        style={{
          width: '95vw',
          maxWidth: '1200px',
          height: '90vh',
          background: '#090d16',
          borderRadius: '16px',
          border: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Top Meeting Bar */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            background: 'linear-gradient(90deg, #0f172a, #1e1b4b)',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Left Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
              <Video size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                  {session.skillTopic}
                </h3>
                <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                  {session.currentUserRole === 'MENTOR' ? 'Hosting as Mentor' : 'Learning from Mentor'}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Peer: {session.currentUserRole === 'MENTOR' ? session.learnerName : session.mentorName} • {session.durationMinutes} mins scheduled
              </span>
            </div>
          </div>

          {/* Center Call Timer & Attendance Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600, background: '#1e293b', padding: '0.3rem 0.75rem', borderRadius: '999px' }}>
              <Clock size={14} style={{ color: '#38bdf8' }} />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: attendanceLogged ? '#34d399' : '#fbbf24',
                background: attendanceLogged ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
              }}
            >
              <CheckCircle size={14} />
              <span>{attendanceLogged ? 'Attendance Verified (Present)' : 'Verifying Attendance...'}</span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={jitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              title="Open video meeting in separate tab if browser blocks iframe"
            >
              <ExternalLink size={13} />
              <span>New Window</span>
            </a>

            <button
              onClick={onClose}
              className="btn btn-danger btn-sm"
              style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#dc2626', color: '#fff', border: 'none' }}
            >
              <PhoneOff size={14} />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Embedded Video Call Frame */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', background: '#020617' }}>
          <iframe
            src={jitsiUrl}
            title="PeerNova Live Video Meeting"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
          />
        </div>
      </div>
    </div>
  );
};
