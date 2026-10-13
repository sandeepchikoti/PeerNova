import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { CertificateModal } from '../components/CertificateModal';
import {
  Award,
  ShieldCheck,
  Calendar,
  Hash,
  ExternalLink,
  BookOpen,
  Video,
  Sparkles,
  Download,
  Printer,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Certificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'SKILL' | 'SESSION'
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await api.getMyCertificates();
      setCertificates(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter((c) => {
    if (filter === 'SKILL') return c.certificateType === 'SKILL_COMPETENCY';
    if (filter === 'SESSION') return c.certificateType === 'SESSION_COMPLETION';
    return true;
  });

  const skillCertsCount = certificates.filter((c) => c.certificateType === 'SKILL_COMPETENCY').length;
  const sessionCertsCount = certificates.filter((c) => c.certificateType === 'SESSION_COMPLETION').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b, #0f172a)',
          borderColor: '#4338ca',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={24} />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Academic Credentials & Certificates
              </h1>
            </div>
            <p style={{ color: '#c7d2fe', fontSize: '0.95rem', maxWidth: '680px', lineHeight: 1.6 }}>
              Official verifiable records of demonstrated technical competency and collaborative learning accomplishments.
              Each credential possesses a cryptographic validation hash recognized across the platform.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '0.85rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fbbf24' }}>
                {certificates.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase' }}>Total Earned</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34d399' }}>
                {skillCertsCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase' }}>Skill Badges</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#818cf8' }}>
                {sessionCertsCount}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', textTransform: 'uppercase' }}>Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setFilter('ALL')}
          className="btn"
          style={{
            backgroundColor: filter === 'ALL' ? 'var(--accent-primary)' : 'transparent',
            color: filter === 'ALL' ? '#fff' : '#9ca3af',
            border: 'none',
            fontWeight: 700,
            padding: '0.55rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          All Credentials ({certificates.length})
        </button>
        <button
          onClick={() => setFilter('SKILL')}
          className="btn"
          style={{
            backgroundColor: filter === 'SKILL' ? 'var(--accent-primary)' : 'transparent',
            color: filter === 'SKILL' ? '#fff' : '#9ca3af',
            border: 'none',
            fontWeight: 700,
            padding: '0.55rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Award size={15} /> Skill Competencies ({skillCertsCount})
        </button>
        <button
          onClick={() => setFilter('SESSION')}
          className="btn"
          style={{
            backgroundColor: filter === 'SESSION' ? 'var(--accent-primary)' : 'transparent',
            color: filter === 'SESSION' ? '#fff' : '#9ca3af',
            border: 'none',
            fontWeight: 700,
            padding: '0.55rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Video size={15} /> Learning Sessions ({sessionCertsCount})
        </button>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
          Loading your verified credentials...
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Award size={36} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            No Certificates in this Category Yet
          </h3>
          <p style={{ color: '#9ca3af', maxWidth: '520px', margin: '0 auto 1.75rem', fontSize: '0.925rem', lineHeight: 1.6 }}>
            Earn certified credentials by clearing standardized MCQ assessments in <strong>Skill Tests</strong> or by
            completing collaborative peer learning meetings in <strong>Sessions</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/student/skill-verification')} className="btn btn-primary">
              <Award size={15} /> Take a Skill Assessment
            </button>
            <button onClick={() => navigate('/student/sessions')} className="btn btn-outline">
              <Video size={15} /> View Learning Sessions
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredCertificates.map((cert) => {
            const isSkillCert = cert.certificateType === 'SKILL_COMPETENCY';
            return (
              <div
                key={cert.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(217, 119, 6, 0.35)',
                  background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.05), var(--bg-card))',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        backgroundColor: isSkillCert ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: isSkillCert ? '#34d399' : '#818cf8',
                        border: `1px solid ${isSkillCert ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {isSkillCert ? <ShieldCheck size={13} /> : <Video size={13} />}
                      {isSkillCert ? 'Skill Competency' : 'Session Completion'}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                      {cert.certificateNumber}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
                    {cert.title}
                  </h3>

                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.75rem' }}>
                    Subject: {cert.subjectName}
                  </div>

                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {cert.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-secondary)',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} style={{ color: '#818cf8' }} />
                      <span>{new Date(cert.issuedAt).toLocaleDateString()}</span>
                    </div>

                    {cert.score != null ? (
                      <span style={{ fontWeight: 800, color: '#34d399' }}>
                        Score: {cert.score.toFixed(1)}%
                      </span>
                    ) : (
                      <span style={{ color: '#818cf8', fontWeight: 600 }}>Attendance Confirmed</span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Award size={15} /> View & Print Credential
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};
