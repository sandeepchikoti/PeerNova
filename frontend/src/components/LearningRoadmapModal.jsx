import React, { useState } from 'react';
import { X, Sparkles, Compass, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Layers, Award, RefreshCw } from 'lucide-react';
import { api } from '../api/apiClient';

export default function LearningRoadmapModal({ isOpen, onClose, currentSkills = [], initialTargetRole = 'Full Stack Software Engineer' }) {
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [careerGoal, setCareerGoal] = useState('High-impact campus placements & engineering excellence');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.aiLearningSuggestions({
        targetRole,
        careerGoal,
        currentSkills,
      });
      setRoadmap(res);
    } catch (err) {
      setError(err.message || 'Failed to generate learning roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '16px',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <Compass size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                AI Learning Roadmap & Career Copilot
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                Powered by Google Gemini AI & PeerNova Academic Curricula
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem' }}>
          {/* Controls Bar */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Target Career Role
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Full Stack Engineer, Cloud Architect"
                  style={{ width: '100%', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Target Career Goal
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g., Campus placements, High-impact internships"
                  style={{ width: '100%', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    borderColor: '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Analyzing with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Career Roadmap
                    </>
                  )}
                </button>
              </div>
            </div>

            {currentSkills && currentSkills.length > 0 && (
              <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Your Skills Evaluated:</span>
                {currentSkills.slice(0, 8).map((sk, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#a5b4fc',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Initial Call-to-action placeholder */}
          {!roadmap && !loading && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#94a3b8',
              border: '2px dashed #334155',
              borderRadius: '12px',
            }}>
              <Compass size={48} style={{ color: '#6366f1', margin: '0 auto 1rem', opacity: 0.7 }} />
              <h3 style={{ color: '#f1f5f9', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                Ready to Map Your Engineering Path
              </h3>
              <p style={{ maxWidth: '520px', margin: '0 auto', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Click <strong>"Generate Career Roadmap"</strong> above. Gemini AI will cross-reference your verified PeerNova competencies, tutoring ratings, and academic goals to generate a 4-phase milestone curriculum.
              </p>
            </div>
          )}

          {/* Generated Roadmap Display */}
          {roadmap && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Readiness Meter & Target Role Header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Roadmap Target
                  </div>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    {roadmap.targetRole}
                  </h3>
                </div>

                <div style={{ minWidth: '200px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ color: '#cbd5e1' }}>Industry Readiness</span>
                    <span style={{ color: '#38bdf8' }}>{roadmap.industryReadinessScore}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${roadmap.industryReadinessScore}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                      borderRadius: '999px',
                      transition: 'width 0.8s ease-out',
                    }} />
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              {roadmap.executiveSummary && (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <Sparkles size={15} /> AI Executive Summary
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                    {roadmap.executiveSummary}
                  </p>
                </div>
              )}

              {/* Missing Crucial Skills */}
              {roadmap.missingSkills && roadmap.missingSkills.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <AlertTriangle size={15} /> High-Priority Knowledge Gaps to Bridge:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {roadmap.missingSkills.map((ms, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        {ms}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 4-Phase Chronological Milestones */}
              {roadmap.milestones && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={17} style={{ color: '#6366f1' }} />
                    Chronological Mastery Milestones
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {roadmap.milestones.map((ms, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          padding: '1.25rem',
                          borderLeft: '4px solid #6366f1',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{
                              background: '#6366f1',
                              color: '#fff',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}>
                              {ms.phase}
                            </span>
                            <strong style={{ fontSize: '1rem', color: '#fff' }}>{ms.title}</strong>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                            ⏱️ {ms.estimatedDuration}
                          </span>
                        </div>

                        {/* Topics */}
                        {ms.coreTopics && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.6rem 0' }}>
                            {ms.coreTopics.map((top, tIdx) => (
                              <span
                                key={tIdx}
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: 'rgba(148, 163, 184, 0.1)',
                                  color: '#cbd5e1',
                                  border: '1px solid #475569',
                                }}
                              >
                                {top}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Practical Project */}
                        {ms.practicalProject && (
                          <div style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '0.4rem 0' }}>
                            <strong style={{ color: '#38bdf8' }}>🛠️ Milestone Project: </strong>
                            {ms.practicalProject}
                          </div>
                        )}

                        {/* PeerNova Action Item */}
                        {ms.peerNovaActionItem && (
                          <div style={{
                            marginTop: '0.6rem',
                            padding: '6px 10px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            color: '#34d399',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}>
                            <Award size={15} />
                            <span><strong>PeerNova Action:</strong> {ms.peerNovaActionItem}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action Checklist */}
              {roadmap.recommendedActionPlan && roadmap.recommendedActionPlan.length > 0 && (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '1.25rem',
                }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                    PeerNova Academic Action Plan
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {roadmap.recommendedActionPlan.map((act, idx) => (
                      <li key={idx} style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #1e293b',
          background: '#090d16',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
        }}>
          <button type="button" onClick={onClose} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}