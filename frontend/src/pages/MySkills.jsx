import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { SkillBadge } from '../components/SkillBadge';
import { AddSkillModal } from '../components/AddSkillModal';
import { GraduationCap, BookOpen, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

export const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSkillsAndCategories = async () => {
    try {
      const [skillsData, categoriesData] = await Promise.all([
        api.getStudentSkills(),
        api.getSkillCategories(),
      ]);
      setSkills(skillsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsAndCategories();
  }, []);

  const handleAddSkill = async (skillData) => {
    const newSkill = await api.addStudentSkill(skillData);
    setSkills((prev) => [...prev, newSkill]);
    setMessage(`Successfully added '${newSkill.skillName}' to your ${newSkill.skillType.toLowerCase()} list.`);
    setTimeout(() => setMessage(''), 3500);
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      await api.removeStudentSkill(skillId);
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      setMessage('Skill removed from your profile.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert(`Error removing skill: ${err.message}`);
    }
  };

  const teachingSkills = skills.filter((s) => s.skillType === 'TEACH');
  const learningSkills = skills.filter((s) => s.skillType === 'LEARN');

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Loading your skills profile...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Panel */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', borderColor: '#3730a3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={24} style={{ color: '#818cf8' }} />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>My Skills Portfolio</h1>
            </div>
            <p style={{ color: '#c7d2fe', fontSize: '0.925rem' }}>
              Define the competencies you can share with peers and the new skills you want to learn.
            </p>
          </div>

          <button onClick={() => setModalOpen(true)} className="btn btn-primary">
            <Plus size={16} /> Add New Skill
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <div>{message}</div>
        </div>
      )}

      {/* Teaching Skills Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={22} style={{ color: '#818cf8' }} />
            <h2 className="card-title">Skills I Can Teach ({teachingSkills.length})</h2>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn btn-outline btn-sm">
            + Add Teaching Skill
          </button>
        </div>

        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Peers looking for mentorship will discover you based on these teaching competencies.
        </p>

        {teachingSkills.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: '#9ca3af', marginBottom: '0.75rem' }}>You haven't added any teaching skills yet.</p>
            <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-sm">
              Add Your First Teaching Skill
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {teachingSkills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} onRemove={handleRemoveSkill} />
            ))}
          </div>
        )}
      </div>

      {/* Learning Skills Card */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={22} style={{ color: '#38bdf8' }} />
            <h2 className="card-title">Skills I Want to Learn ({learningSkills.length})</h2>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn btn-outline btn-sm">
            + Add Learning Skill
          </button>
        </div>

        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          PeerNova matches you with student peers who possess expertise in these subject areas.
        </p>

        {learningSkills.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: '#9ca3af', marginBottom: '0.75rem' }}>You haven't added any learning goals yet.</p>
            <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-sm">
              Add Your First Learning Goal
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {learningSkills.map((skill) => (
              <SkillBadge key={skill.id} skill={skill} onRemove={handleRemoveSkill} />
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddSkill={handleAddSkill}
        categories={categories}
      />
    </div>
  );
};
