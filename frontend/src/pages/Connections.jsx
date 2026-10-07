import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { Users, UserCheck, Clock, Send, CheckCircle2, XCircle, MessageSquare, Calendar, Building, Mail } from 'lucide-react';

export const Connections = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE', 'RECEIVED', 'SENT'
  const [activeConnections, setActiveConnections] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchConnectionsData = async () => {
    setLoading(true);
    try {
      const [active, received, sent] = await Promise.all([
        api.getActiveConnections(),
        api.getPendingReceivedConnections(),
        api.getPendingSentConnections(),
      ]);
      setActiveConnections(active);
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (err) {
      console.error('Failed to load connections data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionsData();
  }, []);

  const handleRespond = async (connectionId, status) => {
    try {
      await api.respondToConnectionRequest(connectionId, status);
      setMessage(`Connection request ${status.toLowerCase()}!`);
      fetchConnectionsData();
      setTimeout(() => setMessage(''), 3500);
    } catch (err) {
      alert(`Error responding to connection request: ${err.message}`);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderColor: '#334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Users size={26} style={{ color: '#10b981' }} />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Peer Connections Directory</h1>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
              Manage your active student learning network, incoming skill exchange requests, and sent invites.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <div>{message}</div>
        </div>
      )}

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', width: 'fit-content' }}>
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className="btn"
          style={{
            backgroundColor: activeTab === 'ACTIVE' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'ACTIVE' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
          }}
        >
          <UserCheck size={16} /> Active Connections ({activeConnections.length})
        </button>

        <button
          onClick={() => setActiveTab('RECEIVED')}
          className="btn"
          style={{
            backgroundColor: activeTab === 'RECEIVED' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'RECEIVED' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
          }}
        >
          <Clock size={16} /> Requests Received ({receivedRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('SENT')}
          className="btn"
          style={{
            backgroundColor: activeTab === 'SENT' ? 'var(--bg-card)' : 'transparent',
            color: activeTab === 'SENT' ? '#fff' : 'var(--text-secondary)',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
          }}
        >
          <Send size={16} /> Requests Sent ({sentRequests.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>Loading connection portfolio...</div>
      ) : (
        <div>
          {/* Active Connections Tab */}
          {activeTab === 'ACTIVE' && (
            <div>
              {activeConnections.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                  <h3>No active connections yet</h3>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.35rem' }}>
                    Explore **Skill Matches** or **Discover Peers** to send connection requests.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {activeConnections.map((conn) => (
                    <div key={conn.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#10b981', color: '#fff', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {conn.senderName ? conn.senderName.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{conn.senderName}</h3>
                            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{conn.senderCollege} • {conn.senderDepartment}</div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={14} style={{ color: '#6366f1' }} /> {conn.senderEmail}
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => window.location.href = `/student/chat?conn=${conn.id}`}
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                        >
                          <MessageSquare size={14} /> Open Chat & Collaboration
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Received Requests Tab */}
          {activeTab === 'RECEIVED' && (
            <div>
              {receivedRequests.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                  <h3>No pending incoming connection requests</h3>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {receivedRequests.map((req) => (
                    <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#6366f1', color: '#fff', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {req.senderName ? req.senderName.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{req.senderName}</h3>
                            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{req.senderCollege} • {req.senderDepartment}</div>
                          </div>
                        </div>

                        {req.message && (
                          <div style={{ fontSize: '0.875rem', color: '#cbd5e1', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontStyle: 'italic' }}>
                            "{req.message}"
                          </div>
                        )}
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleRespond(req.id, 'REJECTED')} className="btn btn-danger btn-sm" style={{ flex: 1 }}>
                          <XCircle size={14} /> Reject Request
                        </button>
                        <button onClick={() => handleRespond(req.id, 'ACCEPTED')} className="btn btn-success btn-sm" style={{ flex: 1 }}>
                          <CheckCircle2 size={14} /> Accept Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sent Requests Tab */}
          {activeTab === 'SENT' && (
            <div>
              {sentRequests.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                  <h3>No pending sent connection requests</h3>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {sentRequests.map((req) => (
                    <div key={req.id} className="card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#0ea5e9', color: '#fff', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {req.receiverName ? req.receiverName.charAt(0).toUpperCase() : 'R'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{req.receiverName}</h3>
                          <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{req.receiverCollege} • {req.receiverDepartment}</div>
                        </div>
                      </div>

                      <div className="badge badge-pending" style={{ fontSize: '0.75rem' }}>
                        Pending Receiver Approval
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
