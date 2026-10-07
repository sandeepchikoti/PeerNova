import React, { useState } from 'react';
import { X, Plus, BookOpen, GraduationCap } from 'lucide-react';

export const AddSkillModal = ({ isOpen, onClose, onAddSkill, categories }) => {
  const [skillName, setSkillName] = useState('');
  const [categoryName, setCategoryName] = useState('Programming Languages');
  const [skillType, setSkillType] = useState('TEACH');
  const [proficiencyLevel, setProficiencyLevel] = useState('INTERMEDIATE');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) {
      setError('Please enter a skill name.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onAddSkill({
        skillName: skillName.trim(),
        categoryName,
        skillType,
        proficiencyLevel,
      });
      setSkillName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add skill');
    } finally {
      setSubmitting(false);
    }
  };

  const selectSuggestedSkill = (name) => {
    setSkillName(name);
  };

  const selectedCategoryObj = categories?.find((c) => c.name === categoryName);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} style={{ color: '#6366f1' }} /> Add Skill to Profile
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.25rem', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Skill Type Switcher */}
          <div className="form-group">
            <label className="form-label">I want to...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${skillType === 'TEACH' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSkillType('TEACH')}
                style={{ padding: '0.6rem', fontSize: '0.875rem' }}
              >
                <GraduationCap size={16} /> Teach Others (Can Teach)
              </button>
              <button
                type="button"
                className={`btn ${skillType === 'LEARN' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSkillType('LEARN')}
                style={{ padding: '0.6rem', fontSize: '0.875rem' }}
              >
                <BookOpen size={16} /> Learn Skill (Want to Learn)
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Skill Category</label>
            <select
              className="form-select"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            >
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Core Computer Science">Core Computer Science</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Mobile Development">Mobile Development</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Skill Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. React.js, Python, Data Structures, Docker..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              required
            />
          </div>

          {/* Popular Suggestions for selected category */}
          {selectedCategoryObj?.popularSkills?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Popular in {categoryName}:</label>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {selectedCategoryObj.popularSkills.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => selectSuggestedSkill(s)}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: skillName === s ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      color: skillName === s ? '#818cf8' : '#e2e8f0',
                      cursor: 'pointer',
                    }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Proficiency Level</label>
            <select
              className="form-select"
              value={proficiencyLevel}
              onChange={(e) => setProficiencyLevel(e.target.value)}
            >
              <option value="BEGINNER">BEGINNER — Fundamentals / Starting out</option>
              <option value="INTERMEDIATE">INTERMEDIATE — Practical experience / Built projects</option>
              <option value="ADVANCED">ADVANCED — Strong proficiency / Can mentor peers</option>
              <option value="EXPERT">EXPERT — Master / Professional level knowledge</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
