import React, { useState } from 'react';
import { X, Send, UserPlus } from 'lucide-react';

export const SendConnectionModal = ({ isOpen, onClose, peer, onSend }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !peer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await onSend(peer.profileId, message);
      setMessage('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send connection request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} style={{ color: '#6366f1' }} /> Connect with {peer.fullName}
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

        <div style={{ marginBottom: '1.25rem', backgroundColor: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{peer.fullName}</div>
          <div style={{ fontSize: '0.825rem', color: '#9ca3af' }}>{peer.college} • {peer.department}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Introductory Message (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder={`Hi ${peer.fullName}, I noticed your skill match on PeerNova and would love to exchange knowledge and collaborate...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Send size={15} /> {submitting ? 'Sending Request...' : 'Send Connection Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
