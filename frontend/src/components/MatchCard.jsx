import React from 'react';
import { SkillBadge } from './SkillBadge';
import { GraduationCap, BookOpen, ShieldCheck, UserPlus, CheckCircle, Clock, Sparkles, RefreshCw } from 'lucide-react';

export const MatchCard = ({ match, onOpenSendModal, onNavigateConnections }) => {
  const isComplementary = match.matchType === 'COMPLEMENTARY';
  const isVerified = match.verificationStatus === 'VERIFIED' || match.verificationStatus === 'APPROVED';

  const renderActionButton = () => {
    switch (match.connectionStatus) {
      case 'CONNECTED':
        return (
          <button className="btn btn-success btn-sm" style={{ width: '100%', cursor: 'default' }} disabled>
            <CheckCircle size={15} /> Active Peer Connection
          </button>
        );
      case 'PENDING_SENT':
        return (
          <button className="btn btn-outline btn-sm" style={{ width: '100%', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }} disabled>
            <Clock size={15} /> Request Sent (Pending)
          </button>
        );
      case 'PENDING_RECEIVED':
        return (
          <button
            onClick={() => onNavigateConnections && onNavigateConnections()}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', backgroundColor: '#f59e0b', borderColor: '#f59e0b' }}
          >
            <Clock size={15} /> Respond to Request
          </button>
        );
      case 'NONE':
      default:
        return (
          <button
            onClick={() => onOpenSendModal && onOpenSendModal(match)}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <UserPlus size={15} /> Send Connection Request
          </button>
        );
    }
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        height: '100%',
        borderColor: isComplementary ? 'rgba(99, 102, 241, 0.5)' : 'var(--border-color)',
        boxShadow: isComplementary ? '0 8px 24px rgba(99, 102, 241, 0.15)' : 'var(--shadow-md)',
      }}
    >
      <div>
        {/* Match Compatibility Badge Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: isComplementary ? 'rgba(99, 102, 241, 0.2)' : 'rgba(14, 165, 233, 0.2)',
              color: isComplementary ? '#a5b4fc' : '#38bdf8',
              border: `1px solid ${isComplementary ? 'rgba(99, 102, 241, 0.4)' : 'rgba(14, 165, 233, 0.4)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={13} /> {match.matchScore}% {isComplementary ? 'MUTUAL EXCHANGE MATCH' : 'DIRECT SKILL MATCH'}
          </span>

          <span className={`badge ${isVerified ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '0.7rem' }}>
            {isVerified ? 'VERIFIED' : 'PENDING'}
          </span>
        </div>

        {/* Student Name & Institution */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: isComplementary
                ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {match.fullName ? match.fullName.charAt(0).toUpperCase() : 'S'}
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              {match.fullName}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.15rem' }}>
              {match.college} • {match.department} ({match.yearOfStudy})
            </div>
          </div>
        </div>

        {match.bio && (
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1.25rem', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {match.bio}
          </p>
        )}

        {/* Section 1: They Can Teach You */}
        {match.matchingSkillsToTeach?.length > 0 && (
          <div style={{ marginBottom: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <GraduationCap size={14} /> They Can Teach You:
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {match.matchingSkillsToTeach.map((skill) => (
                <SkillBadge key={skill.id || skill.skillName} skill={skill} showCategory={false} />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: You Can Teach Them */}
        {match.matchingSkillsToLearn?.length > 0 && (
          <div style={{ marginBottom: '1.25rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={14} /> You Can Teach Them:
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {match.matchingSkillsToLearn.map((skill) => (
                <SkillBadge key={skill.id || skill.skillName} skill={skill} showCategory={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
        {renderActionButton()}
      </div>
    </div>
  );
};
