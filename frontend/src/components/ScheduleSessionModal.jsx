import React, { useState } from 'react';
import { api } from '../api/apiClient';
import { X, Calendar, Clock, Video, BookOpen, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

export const ScheduleSessionModal = ({ isOpen, onClose, peer, onSuccess }) => {
  const [sessionRole, setSessionRole] = useState('LEARN'); // 'LEARN' (peer teaches) or 'TEACH' (current user teaches)
  const [skillTopic, setSkillTopic] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !peer) return null;

  // Compute minimum datetime string for datetime-local input (current time + 10 mins)
  const now = new Date(Date.now() + 10 * 60 * 1000);
  const minDateTime = now.toISOString().slice(0, 16);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillTopic.trim()) {
      setError('Please specify a skill or learning topic.');
      return;
    }
    if (!scheduledAt) {
      setError('Please select a scheduled date and time.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        peerProfileId: peer.profileId || peer.id,
        sessionRole,
        skillTopic: skillTopic.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: parseInt(durationMinutes, 10),
        description: description.trim() || `Collaborative learning session on ${skillTopic.trim()}`,
      };

      await api.requestSession(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to request learning session.');
    } finally {
      setLoading(false);
    }
  };

  const relevantSkills = sessionRole === 'LEARN'
    ? (peer.teachingSkills || [])
    : (peer.learningSkills || []);

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <Video size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Schedule Learning Session</h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>with {peer.fullName || peer.name}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Peer Card Summary */}
          <div style={{ background: '#0b0f19', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Peer Collaborator</div>
            <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{peer.fullName || peer.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{peer.college} • {peer.department}</div>
          </div>

          {/* Session Direction */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Session Direction & Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSessionRole('LEARN')}
                className={`btn btn-sm ${sessionRole === 'LEARN' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.55rem' }}
              >
                🎓 I want to Learn (Peer Teaches)
              </button>
              <button
                type="button"
                onClick={() => setSessionRole('TEACH')}
                className={`btn btn-sm ${sessionRole === 'TEACH' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.55rem' }}
              >
                💡 I will Teach (I am Mentor)
              </button>
            </div>
          </div>

          {/* Topic / Skill */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>
              Skill or Topic to Cover *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. React Custom Hooks, Spring Boot Security, LeetCode Trees..."
              value={skillTopic}
              onChange={(e) => setSkillTopic(e.target.value)}
              required
            />
            {relevantSkills.length > 0 && (
              <div style={{ marginTop: '0.4rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Quick select:</span>
                {relevantSkills.slice(0, 4).map((sk, idx) => {
                  const sName = typeof sk === 'string' ? sk : sk.skillName;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSkillTopic(sName)}
                      className="badge badge-accent"
                      style={{ cursor: 'pointer', border: 'none', fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                    >
                      + {sName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date & Time and Duration Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Date & Time *</label>
              <input
                type="datetime-local"
                className="form-control"
                min={minDateTime}
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem' }}>Duration</label>
              <select
                className="form-control"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              >
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>
          </div>

          {/* Description / Learning Notes */}
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Session Agenda & Notes</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="What specific questions or topics would you like to review during this video session?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              {loading ? (
                'Scheduling...'
              ) : (
                <>
                  <Calendar size={15} /> Send Session Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
