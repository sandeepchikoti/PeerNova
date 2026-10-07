import React from 'react';
import { X, Award, BookOpen } from 'lucide-react';

export const SkillBadge = ({ skill, onRemove, showCategory = true }) => {
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

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: isTeaching ? 'rgba(99, 102, 241, 0.12)' : 'rgba(14, 165, 233, 0.12)',
        border: `1px solid ${isTeaching ? 'rgba(99, 102, 241, 0.3)' : 'rgba(14, 165, 233, 0.3)'}`,
        fontSize: '0.85rem',
        color: '#f8fafc',
        transition: 'var(--transition)',
      }}
    >
      <span style={{ fontWeight: 700, color: '#fff' }}>{skill.skillName}</span>

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
