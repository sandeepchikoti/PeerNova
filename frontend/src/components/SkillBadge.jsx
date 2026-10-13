import React from 'react';
import { X, Award, CheckCircle, ShieldCheck } from 'lucide-react';

export const SkillBadge = ({ skill, onRemove, onVerifyClick, showCategory = true }) => {
  const getProficiencyColor = (level) => {
    switch (level) {
      case 'EXPERT':
        return { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' };
      case 'ADVANCED':
        return { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'rgba(16, 185, 129, 0.4)' };
      case 'INTERMEDIATE':
        return { bg: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.4)' };
      case 'BEGINNER':
      default:
        return { bg: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', border: 'rgba(14, 165, 233, 0.4)' };
    }
  };

  const profStyle = getProficiencyColor(skill.proficiencyLevel);
  const isTeaching = skill.skillType === 'TEACH';
  const isVerified = Boolean(skill.isVerified || skill.verified);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: isVerified
          ? 'rgba(16, 185, 129, 0.08)'
          : isTeaching
          ? 'rgba(99, 102, 241, 0.12)'
          : 'rgba(14, 165, 233, 0.12)',
        border: `1px solid ${
          isVerified
            ? 'rgba(16, 185, 129, 0.5)'
            : isTeaching
            ? 'rgba(99, 102, 241, 0.3)'
            : 'rgba(14, 165, 233, 0.3)'
        }`,
        fontSize: '0.85rem',
        color: '#f8fafc',
        boxShadow: isVerified ? '0 0 10px rgba(16, 185, 129, 0.15)' : 'none',
        transition: 'var(--transition)',
      }}
    >
      <span style={{ fontWeight: 700, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
        {skill.skillName}
      </span>

      {showCategory && skill.categoryName && (
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.4rem' }}>
          {skill.categoryName}
        </span>
      )}

      {skill.proficiencyLevel && (
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.15rem 0.45rem',
            borderRadius: '999px',
            backgroundColor: profStyle.bg,
            color: profStyle.color,
            border: `1px solid ${profStyle.border}`,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
          }}
        >
          {skill.proficiencyLevel}
        </span>
      )}

      {/* Phase 7: Verified Skill Badge */}
      {isVerified ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '0.15rem 0.45rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
          title={`Verified Skill: Score ${skill.verificationScore ? Math.round(skill.verificationScore) + '%' : 'Passed'}`}
        >
          <ShieldCheck size={12} style={{ color: '#10b981' }} />
          VERIFIED {skill.verificationScore ? `${Math.round(skill.verificationScore)}%` : ''}
        </span>
      ) : onVerifyClick && isTeaching ? (
        <button
          onClick={() => onVerifyClick(skill)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#fbbf24',
            borderRadius: '999px',
            padding: '0.1rem 0.45rem',
            fontSize: '0.68rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
          title="Take MCQ Assessment to earn Verified Badge"
        >
          <Award size={11} />
          Verify
        </button>
      ) : null}

      {onRemove && (
        <button
          onClick={() => onRemove(skill.id)}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '4px',
            transition: 'var(--transition)',
          }}
          title="Remove Skill"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
