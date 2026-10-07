import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/apiClient';
import { RecommendationCard } from '../components/RecommendationCard';
import { SendConnectionModal } from '../components/SendConnectionModal';
import { Brain, RefreshCw, CheckCircle2, ArrowRight, Sparkles, Cpu, Layers } from 'lucide-react';

export const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [message, setMessage] = useState('');
  const [filterCluster, setFilterCluster] = useState('ALL');

  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await api.getPersonalizedRecommendations();
      setRecommendations(data || []);
    } catch (err) {
      console.error('Failed to load AI/ML recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleSendConnection = async (receiverProfileId, introMessage) => {
    await api.sendConnectionRequest({ receiverProfileId, message: introMessage });
    setMessage('Connection request sent successfully!');
    fetchRecommendations();
    setTimeout(() => setMessage(''), 3500);
  };

  // Get distinct cluster IDs
  const clusters = ['ALL', ...new Set(recommendations.map((r) => r.clusterId).filter(Boolean))];

  const filteredRecs = filterCluster === 'ALL'
    ? recommendations
    : recommendations.filter((r) => r.clusterId === parseInt(filterCluster));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* AI Header Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.95), rgba(15, 23, 42, 0.98))',
          borderColor: 'rgba(168, 85, 247, 0.4)',
          boxShadow: '0 10px 30px rgba(168, 85, 247, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <Brain size={28} style={{ color: '#e879f9' }} />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>AI/ML Personalized Recommendations</h1>
            </div>
            <p style={{ color: '#e9d5ff', fontSize: '0.925rem', maxWidth: '750px', lineHeight: 1.5 }}>
              Powered by Python Scikit-Learn Machine Learning: Cosine Similarity Vectorization, K-Nearest Neighbors (KNN), and K-Means Skill Clustering.
            </p>
          </div>

          <button onClick={fetchRecommendations} className="btn btn-outline btn-sm" style={{ color: '#e879f9', borderColor: 'rgba(232, 121, 249, 0.4)' }}>
            <RefreshCw size={14} /> Re-run ML Engine
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <div>{message}</div>
        </div>
      )}

      {/* Cluster Filter Pill Strip */}
      {!loading && recommendations.length > 0 && clusters.length > 2 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={15} style={{ color: '#a855f7' }} /> Filter Learning Clusters:
          </span>
          {clusters.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCluster(c.toString())}
              className={`btn btn-sm ${filterCluster === c.toString() ? 'btn-primary' : 'btn-outline'}`}
              style={{
                fontSize: '0.75rem',
                borderRadius: '999px',
                padding: '0.25rem 0.75rem',
                ...(filterCluster === c.toString() ? { backgroundColor: '#a855f7', borderColor: '#a855f7' } : {}),
              }}
            >
              {c === 'ALL' ? 'All Clusters' : `Cluster #${c}`}
            </button>
          ))}
        </div>
      )}

      {/* Recommendations Body */}
      {loading ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Brain size={40} className="animate-pulse" style={{ color: '#c084fc' }} />
          </div>
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Running Machine Learning Pipeline...</h3>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
            Extracting skill TF-IDF vectors • Computing Cosine Similarity • Querying KNN Nearest Neighbors • Grouping K-Means Clusters
          </p>
        </div>
      ) : filteredRecs.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No AI recommendations found</h3>
          <p style={{ color: '#9ca3af', marginBottom: '1.25rem', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
            Add more skills to your profile or register additional peer profiles to generate recommendations.
          </p>
          <button onClick={() => navigate('/student/skills')} className="btn btn-primary">
            Update My Skills Portfolio <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: '#e879f9' }} /> Top AI Recommended Peer Mentors ({filteredRecs.length})
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              Sorted by Machine Learning Match Score
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {filteredRecs.map((rec) => (
              <RecommendationCard
                key={rec.profileId}
                recommendation={rec}
                onOpenSendModal={setSelectedPeer}
                onNavigateConnections={() => navigate('/student/connections')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Send Connection Modal */}
      <SendConnectionModal
        isOpen={!!selectedPeer}
        onClose={() => setSelectedPeer(null)}
        peer={selectedPeer}
        onSend={handleSendConnection}
      />
    </div>
  );
};
