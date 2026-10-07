import React from 'react';
import { SkillBadge } from './SkillBadge';
import { ShieldCheck, GraduationCap, BookOpen, Building, UserPlus, Sparkles } from 'lucide-react';

export const StudentCard = ({ student, onConnect }) => {
  const isVerified = student.verificationStatus === 'VERIFIED' || student.verificationStatus === 'APPROVED';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        {/* Header with Avatar & Status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
              }}
            >
              {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                {student.fullName}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                <Building size={12} /> {student.college || 'Institution'}
              </div>
            </div>
          </div>

          <span className={`badge ${isVerified ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '0.7rem' }}>
            {isVerified ? 'VERIFIED' : 'PENDING'}
          </span>
        </div>

        <div style={{ fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            {student.department}
          </span>
          <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            {student.yearOfStudy}
          </span>
        </div>

        {student.bio && (
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.25rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {student.bio}
          </p>
        )}

        {/* Teaching Skills Section */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.5rem' }}>
            <GraduationCap size={15} /> Can Teach ({student.teachingSkills?.length || 0}):
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {student.teachingSkills && student.teachingSkills.length > 0 ? (
              student.teachingSkills.map((skill) => (
                <SkillBadge key={skill.id || skill.skillName} skill={skill} showCategory={false} />
              ))
            ) : (
              <span style={{ fontSize: '0.78rem', color: '#6b7280', italic: 'true' }}>No teaching skills listed yet</span>
            )}
          </div>
        </div>

        {/* Learning Skills Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
            <BookOpen size={15} /> Wants to Learn ({student.learningSkills?.length || 0}):
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {student.learningSkills && student.learningSkills.length > 0 ? (
              student.learningSkills.map((skill) => (
                <SkillBadge key={skill.id || skill.skillName} skill={skill} showCategory={false} />
              ))
            ) : (
              <span style={{ fontSize: '0.78rem', color: '#6b7280', italic: 'true' }}>No learning skills listed yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
        <button
          onClick={() => onConnect && onConnect(student)}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <UserPlus size={15} /> Connect & Exchange Skills
        </button>
      </div>
    </div>
  );
};
