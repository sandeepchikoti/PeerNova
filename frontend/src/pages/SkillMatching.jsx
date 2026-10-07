import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/apiClient';
import { MatchCard } from '../components/MatchCard';
import { SendConnectionModal } from '../components/SendConnectionModal';
import { Sparkles, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export const SkillMatching = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getSkillMatches();
      setMatches(data);
    } catch (err) {
      console.error('Failed to load skill matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleSendConnection = async (receiverProfileId, introMessage) => {
    await api.sendConnectionRequest({ receiverProfileId, message: introMessage });
    setMessage('Connection request sent successfully!');
    fetchMatches();
    setTimeout(() => setMessage(''), 3500);
  };

  const complementaryMatches = matches.filter((m) => m.matchType === 'COMPLEMENTARY');
  const directMatches = matches.filter((m) => m.matchType === 'DIRECT_TEACH');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', borderColor: '#3730a3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={26} style={{ color: '#818cf8' }} />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Skill Exchange Peer Matching</h1>
            </div>
            <p style={{ color: '#c7d2fe', fontSize: '0.925rem' }}>
              Real-time algorithm matching students who teach what you want to learn and learn what you teach.
            </p>
          </div>

          <button onClick={fetchMatches} className="btn btn-outline btn-sm">
            <RefreshCw size={14} /> Recalculate Matches
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <div>{message}</div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
          Analyzing teaching and learning skills across student network...
        </div>
      ) : matches.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No direct skill matches found yet</h3>
          <p style={{ color: '#9ca3af', marginBottom: '1.25rem', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
            Add more teaching and learning skills to your portfolio to unlock complementary peer matches.
          </p>
          <button onClick={() => navigate('/student/skills')} className="btn btn-primary">
            Manage My Skills Portfolio <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: Complementary 2-Way Mutual Skill Matches */}
          {complementaryMatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-verified" style={{ padding: '0.35rem 0.85rem' }}>
                  2-WAY MUTUAL EXCHANGE
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
                  Complementary Peer Matches ({complementaryMatches.length})
                </h2>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Highest priority matches: These peers teach skills you want to learn AND want to learn skills you can teach.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {complementaryMatches.map((match) => (
                  <MatchCard
                    key={match.profileId}
                    match={match}
                    onOpenSendModal={setSelectedPeer}
                    onNavigateConnections={() => navigate('/student/connections')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Direct 1-Way Skill Matches */}
          {directMatches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="badge badge-pending" style={{ padding: '0.35rem 0.85rem' }}>
                  1-WAY MATCH
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
                  Direct Skill Matches ({directMatches.length})
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {directMatches.map((match) => (
                  <MatchCard
                    key={match.profileId}
                    match={match}
                    onOpenSendModal={setSelectedPeer}
                    onNavigateConnections={() => navigate('/student/connections')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Send Request Modal */}
      <SendConnectionModal
        isOpen={!!selectedPeer}
        onClose={() => setSelectedPeer(null)}
        peer={selectedPeer}
        onSend={handleSendConnection}
      />
    </div>
  );
};
