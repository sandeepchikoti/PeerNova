import React from 'react';
import { SkillBadge } from './SkillBadge';
import { GraduationCap, BookOpen, UserPlus, CheckCircle, Clock, Cpu, Brain, Layers, Sparkles } from 'lucide-react';

export const RecommendationCard = ({ recommendation, onOpenSendModal, onNavigateConnections }) => {
  const isVerified = recommendation.verificationStatus === 'VERIFIED' || recommendation.verificationStatus === 'APPROVED';

  const renderActionButton = () => {
    switch (recommendation.connectionStatus) {
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
            onClick={() => onOpenSendModal && onOpenSendModal(recommendation)}
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
        justifyContent: 'space-between',
        height: '100%',
        borderColor: 'rgba(168, 85, 247, 0.4)',
        boxShadow: '0 8px 30px rgba(168, 85, 247, 0.15)',
        background: 'linear-gradient(180deg, rgba(26, 31, 46, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow highlight strip on top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)' }} />

      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '0.25rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.3rem 0.8rem',
              borderRadius: '999px',
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Brain size={14} style={{ color: '#e879f9' }} /> {recommendation.mlScore?.toFixed(1)}% AI/ML MATCH
          </span>

          <span className={`badge ${isVerified ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '0.7rem' }}>
            {isVerified ? 'VERIFIED' : 'PENDING'}
          </span>
        </div>

        {/* Peer Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)',
            }}
          >
            {recommendation.fullName ? recommendation.fullName.charAt(0).toUpperCase() : 'S'}
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              {recommendation.fullName}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.15rem' }}>
              {recommendation.college} • {recommendation.department} ({recommendation.yearOfStudy})
            </div>
          </div>
        </div>

        {recommendation.bio && (
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1rem', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {recommendation.bio}
          </p>
        )}

        {/* ML Rationale & Metrics Box */}
        <div
          style={{
            marginBottom: '1rem',
            backgroundColor: 'rgba(124, 58, 237, 0.08)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} /> AI Recommendation Rationale:
          </div>
          <div style={{ fontSize: '0.825rem', color: '#e2e8f0', lineHeight: 1.4, marginBottom: '0.6rem' }}>
            {recommendation.mlExplanation || 'Recommended based on skill vector similarity and collaborative learning cluster analysis.'}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.725rem' }}>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Cpu size={12} style={{ color: '#38bdf8' }} /> Cosine Sim: <strong style={{ color: '#38bdf8' }}>{recommendation.cosineSimilarity}</strong>
            </span>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Layers size={12} style={{ color: '#f43f5e' }} /> KNN Dist: <strong style={{ color: '#f43f5e' }}>{recommendation.knnDistance}</strong>
            </span>
            <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Brain size={12} style={{ color: '#a855f7' }} /> Cluster: <strong style={{ color: '#a855f7' }}>#{recommendation.clusterId}</strong>
            </span>
          </div>
        </div>

        {/* Section: Can Teach */}
        {recommendation.teachingSkills?.length > 0 && (
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <GraduationCap size={14} /> Skills They Teach:
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {recommendation.teachingSkills.map((skill) => (
                <SkillBadge key={skill.id || skill.skillName} skill={skill} showCategory={false} />
              ))}
            </div>
          </div>
        )}

        {/* Section: Wants to Learn */}
        {recommendation.learningSkills?.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={14} /> Skills They Want to Learn:
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {recommendation.learningSkills.map((skill) => (
                <SkillBadge key={skill.id || skill.skillName} skill={skill} showCategory={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
        {renderActionButton()}
      </div>
    </div>
  );
};
