import React, { useState } from 'react';
import { api } from '../api/apiClient';
import { X, Star, MessageSquare, ThumbsUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ReviewModal = ({ session, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [knowledgeRating, setKnowledgeRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        rating,
        communicationRating,
        knowledgeRating,
        comment: comment.trim(),
      };
      const result = await api.submitSessionReview(session.id, payload);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit peer review.');
      setSubmitting(false);
    }
  };

  const getRatingLabel = (val) => {
    switch (val) {
      case 5: return 'Outstanding — Highly Recommended!';
      case 4: return 'Very Good — Thorough & Helpful';
      case 3: return 'Good — Addressed Questions';
      case 2: return 'Fair — Needs Improvement';
      case 1: return 'Poor — Inadequate Session';
      default: return '';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1.25rem',
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header */}
        <div className="card-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', marginBottom: '0.2rem' }}>
              <Star size={18} fill="#fbbf24" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Peer Mentorship Feedback
              </span>
            </div>
            <h2 className="card-title" style={{ fontSize: '1.3rem' }}>Rate Learning Session</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
              Topic: <strong style={{ color: '#fff' }}>{session.skillTopic}</strong> with {session.mentorName || 'Peer'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ margin: '1rem 0' }}>
            <AlertCircle size={16} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          {/* Main Overall Star Rating */}
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '0.5rem' }}>
              Overall Mentorship Quality
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    transition: 'transform 0.15s ease',
                    transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  <Star
                    size={32}
                    color={(hoverRating || rating) >= star ? '#fbbf24' : '#4b5563'}
                    fill={(hoverRating || rating) >= star ? '#fbbf24' : 'transparent'}
                  />
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
              {getRatingLabel(hoverRating || rating)}
            </div>
          </div>

          {/* Sub Criteria */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Communication & Clarity
              </label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    onClick={() => setCommunicationRating(s)}
                    style={{ cursor: 'pointer' }}
                    color={communicationRating >= s ? '#38bdf8' : '#4b5563'}
                    fill={communicationRating >= s ? '#38bdf8' : 'transparent'}
                  />
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Subject Knowledge
              </label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    onClick={() => setKnowledgeRating(s)}
                    style={{ cursor: 'pointer' }}
                    color={knowledgeRating >= s ? '#a855f7' : '#4b5563'}
                    fill={knowledgeRating >= s ? '#a855f7' : 'transparent'}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Comment Field */}
          <div>
            <label style={{ fontSize: '0.825rem', color: '#e2e8f0', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              Constructive Review & Peer Feedback
            </label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="How well did your peer mentor explain concepts? Was the pace suitable? What did you accomplish together?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', resize: 'vertical', fontSize: '0.9rem' }}
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Submitting Review...' : 'Publish Peer Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
