import React from 'react';

/**
 * High-fidelity ATS Resume Preview Component.
 * Supports "MODERN" and "CLASSIC" design templates.
 * Includes embedded print stylesheet for pixel-perfect PDF export via window.print().
 */
export default function ResumePreview({ resume, template = 'MODERN' }) {
  if (!resume) return null;

  const isModern = template === 'MODERN';

  return (
    <div className="resume-sheet-container">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .resume-sheet, .resume-sheet * {
            visibility: visible;
          }
          .resume-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 18mm 20mm !important;
            box-shadow: none !important;
            background: white !important;
            color: #111827 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        className={`resume-sheet ${isModern ? 'template-modern' : 'template-classic'}`}
        id="resume-printable-area"
        style={{
          backgroundColor: '#ffffff',
          color: '#1f2937',
          padding: '36px 40px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
          maxWidth: '820px',
          margin: '0 auto',
          fontFamily: isModern ? "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" : "'Georgia', serif",
          lineHeight: '1.5',
          fontSize: '13.5px',
        }}
      >
        {/* Header Section */}
        <header style={{ borderBottom: isModern ? '2.5px solid #4f46e5' : '1.5px solid #374151', paddingBottom: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: isModern ? '#1e1b4b' : '#111827', letterSpacing: '-0.5px' }}>
                {resume.fullName || 'Student Name'}
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: 600, color: isModern ? '#4f46e5' : '#4b5563' }}>
                {resume.headline || resume.targetRole || 'Full Stack Engineer & Peer Mentor'}
              </p>
            </div>
            {resume.includePeerNovaMetrics && (resume.peerRating > 0 || resume.verifiedSkillsCount > 0) && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#15803d',
                fontWeight: 700,
                textAlign: 'right'
              }}>
                <div>⭐ {resume.peerRating > 0 ? resume.peerRating.toFixed(1) : '5.0'} PeerNova Mentor Rating</div>
                <div>✓ {resume.verifiedSkillsCount || 0} Verified Skills • {resume.completedSessionsCount || 0} Sessions Taught</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '10px', fontSize: '12px', color: '#4b5563' }}>
            {resume.email && <span>📧 {resume.email}</span>}
            {resume.phone && <span>📱 {resume.phone}</span>}
            {resume.location && <span>📍 {resume.location}</span>}
            {resume.githubUrl && (
              <span>🔗 <a href={resume.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>GitHub</a></span>
            )}
            {resume.linkedinUrl && (
              <span>💼 <a href={resume.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>LinkedIn</a></span>
            )}
            {resume.portfolioUrl && (
              <span>🌐 <a href={resume.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>Portfolio</a></span>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {resume.summary && (
          <section style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isModern ? '#4f46e5' : '#111827',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '3px',
              marginBottom: '6px'
            }}>
              Professional Summary
            </h2>
            <p style={{ margin: 0, color: '#374151', textAlign: 'justify', lineHeight: 1.55 }}>
              {resume.summary}
            </p>
          </section>
        )}

        {/* Education Section */}
        {resume.education && resume.education.length > 0 && (
          <section style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isModern ? '#4f46e5' : '#111827',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '3px',
              marginBottom: '6px'
            }}>
              Education
            </h2>
            {resume.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: idx < resume.education.length - 1 ? '8px' : '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14px', color: '#111827' }}>{edu.institution}</strong>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                    {edu.startYear} – {edu.endYear || 'Present'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4b5563' }}>
                  <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                  {edu.gpa && <span style={{ fontWeight: 600, color: '#1f2937' }}>{edu.gpa}</span>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Experience Section */}
        {resume.experience && resume.experience.length > 0 && (
          <section style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isModern ? '#4f46e5' : '#111827',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '3px',
              marginBottom: '6px'
            }}>
              Experience & Leadership
            </h2>
            {resume.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '14px', color: '#111827' }}>{exp.role}</strong>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: isModern ? '#4338ca' : '#4b5563', fontWeight: 600, marginBottom: '4px' }}>
                  {exp.organization} {exp.location ? `• ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p style={{ margin: '0 0 4px', color: '#4b5563', fontSize: '13px' }}>{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151' }}>
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ marginBottom: '2px' }}>{h.replace(/^[•\-\*]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects Section */}
        {resume.projects && resume.projects.length > 0 && (
          <section style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isModern ? '#4f46e5' : '#111827',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '3px',
              marginBottom: '6px'
            }}>
              Technical Projects
            </h2>
            {resume.projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#111827' }}>{proj.title}</strong>
                    {proj.techStack && (
                      <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px', fontStyle: 'italic' }}>
                        | {proj.techStack}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', display: 'flex', gap: '8px' }}>
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Code</a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>Live Demo</a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p style={{ margin: '2px 0 3px', color: '#4b5563', fontSize: '13px' }}>{proj.description}</p>
                )}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151' }}>
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ marginBottom: '2px' }}>{h.replace(/^[•\-\*]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Technical Skills & Verified Competencies */}
        {resume.skillCategories && resume.skillCategories.length > 0 && (
          <section style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isModern ? '#4f46e5' : '#111827',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '3px',
              marginBottom: '6px'
            }}>
              Skills & Proficiencies
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {resume.skillCategories.map((cat, idx) => (
                <div key={idx} style={{ fontSize: '13px' }}>
                  <strong style={{ color: '#1f2937' }}>{cat.category}: </strong>
                  <span style={{ color: '#4b5563' }}>
                    {cat.skills ? cat.skills.join(' • ') : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & PeerNova Credentials */}
        {resume.certifications && resume.certifications.length > 0 && (
          <section style={{ marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isModern ? '#4f46e5' : '#111827',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '3px',
              marginBottom: '6px'
            }}>
              Certifications & Academic Credentials
            </h2>
            {resume.certifications.map((cert, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <div>
                  <strong style={{ color: '#111827' }}>{cert.title}</strong>
                  <span style={{ color: '#6b7280' }}> — {cert.issuer}</span>
                  {cert.verificationId && (
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '11px',
                      background: '#f1f5f9',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      color: '#475569'
                    }}>
                      ID: {cert.verificationId}
                    </span>
                  )}
                </div>
                <span style={{ color: '#6b7280', fontSize: '12px' }}>{cert.issueDate}</span>
              </div>
            ))}
          </section>
        )}

        {/* Achievements Section */}
        {resume.achievements && resume.achievements.length > 0 && (
          <section>
            <h2 style={{
              fontSize: '13px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: isModern ? '#4f46e5' : '#111827',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '3px',
              marginBottom: '6px'
            }}>
              Honors & Achievements
            </h2>
            {resume.achievements.map((ach, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <div>
                  <strong style={{ color: '#111827' }}>{ach.title}</strong>
                  {ach.description && <span style={{ color: '#4b5563' }}>: {ach.description}</span>}
                </div>
                {ach.year && <span style={{ color: '#6b7280', fontSize: '12px' }}>{ach.year}</span>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
