import React, { useRef } from 'react';
import {
  X,
  Printer,
  Share2,
  CheckCircle,
  ShieldCheck,
  Award,
  Calendar,
  Hash,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const CertificateModal = ({ certificate, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    const text = certificate.verificationCode;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isSkill = certificate.certificateType === 'SKILL_COMPETENCY';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1.25rem',
        overflowY: 'auto',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Actions bar above certificate */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} style={{ color: '#fbbf24' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Official PeerNova Verified Credential</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleCopyCode}
              className="btn btn-outline btn-sm"
              style={{ color: copied ? '#34d399' : '#e2e8f0', borderColor: copied ? '#34d399' : 'var(--border-color)' }}
            >
              <Hash size={14} /> {copied ? 'Code Copied!' : 'Copy Code'}
            </button>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Certificate Canvas / Frame */}
        <div
          id="peernova-certificate-canvas"
          style={{
            position: 'relative',
            backgroundColor: '#0a0f1d',
            borderRadius: '16px',
            border: '8px double #d97706',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(217, 119, 6, 0.25)',
            padding: '3rem 2.5rem',
            color: '#f8fafc',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Background Guilloche / Watermark */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at center, rgba(217, 119, 6, 0.04) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Corner Ornamental Accents */}
          <div style={{ position: 'absolute', top: 12, left: 14, color: '#f59e0b', fontSize: '1.2rem', opacity: 0.6 }}>✦</div>
          <div style={{ position: 'absolute', top: 12, right: 14, color: '#f59e0b', fontSize: '1.2rem', opacity: 0.6 }}>✦</div>
          <div style={{ position: 'absolute', bottom: 12, left: 14, color: '#f59e0b', fontSize: '1.2rem', opacity: 0.6 }}>✦</div>
          <div style={{ position: 'absolute', bottom: 12, right: 14, color: '#f59e0b', fontSize: '1.2rem', opacity: 0.6 }}>✦</div>

          {/* Certificate Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: '0.2em',
                color: '#fbbf24',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
                paddingBottom: '0.4rem',
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={13} /> PEERNOVA ACADEMIC ECOSYSTEM <Sparkles size={13} />
            </div>

            <h1
              style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                fontFamily: 'serif',
                letterSpacing: '0.04em',
                color: '#fff',
                textTransform: 'uppercase',
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              {certificate.title}
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.25rem' }}>
              Standardized Peer Verification & Collaborative Learning Credential
            </p>
          </div>

          {/* Recipient Section */}
          <div style={{ margin: '2rem 0' }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              This is proudly presented to
            </p>

            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                fontFamily: 'serif',
                color: '#fbbf24',
                letterSpacing: '0.02em',
                margin: '0.5rem 0',
                borderBottom: '2px solid rgba(217, 119, 6, 0.4)',
                display: 'inline-block',
                padding: '0 2rem 0.25rem',
              }}
            >
              {certificate.recipientName}
            </div>

            <p
              style={{
                color: '#e2e8f0',
                fontSize: '1rem',
                maxWidth: '650px',
                margin: '1.25rem auto 0',
                lineHeight: 1.7,
              }}
            >
              {certificate.description}
            </p>

            {certificate.score != null && (
              <div style={{ marginTop: '1rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 1rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    color: '#34d399',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                  }}
                >
                  <ShieldCheck size={16} /> Certified Evaluation Score: {certificate.score.toFixed(1)}% (Passed)
                </span>
              </div>
            )}
          </div>

          {/* Footer Metadata & Official Seals */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '2rem',
              marginTop: '2.5rem',
              textAlign: 'left',
            }}
          >
            {/* Left: Credential Details */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                Credential ID
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.05em' }}>
                {certificate.certificateNumber}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginTop: '0.6rem' }}>
                Date Issued
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            {/* Center: Official Seal Stamp */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '3px dashed #f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)',
                }}
              >
                <ShieldCheck size={32} style={{ color: '#fbbf24' }} />
                <span style={{ fontSize: '0.62rem', fontWeight: 900, color: '#fbbf24', letterSpacing: '0.1em' }}>
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Right: Authority Signature */}
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: 'cursive',
                  fontSize: '1.4rem',
                  color: '#fbbf24',
                  marginBottom: '0.2rem',
                }}
              >
                Academic Council
              </div>
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '0.3rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>
                  PeerNova Academic Authority
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Institutional Evaluation Board
                </div>
              </div>
            </div>
          </div>

          {/* Verification Code Hash footer */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '0.75rem',
              borderTop: '1px dotted rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.7rem',
              color: '#64748b',
            }}
          >
            <span>Verification Hash: {certificate.verificationCode}</span>
            <span>https://peernova.edu/verify/{certificate.verificationCode.slice(0, 10)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
