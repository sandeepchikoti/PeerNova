import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { SkillAssessmentModal } from '../components/SkillAssessmentModal';
import {
  Award,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const SkillVerification = () => {
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'history'
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const loadVerificationData = async () => {
    try {
      setLoading(true);
      const [testsData, attemptsData] = await Promise.all([
        api.getSkillTests(),
        api.getMyTestAttempts(),
      ]);
      setTests(testsData || []);
      setAttempts(attemptsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load skill tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationData();
  }, []);

  const handleAssessmentCompleted = (result) => {
    loadVerificationData();
    if (result.passed) {
      setToastMessage(`🎉 Fantastic job! You passed the assessment with ${result.scorePercentage.toFixed(1)}% and unlocked your verified badge!`);
    } else {
      setToastMessage(`Assessment complete. You scored ${result.scorePercentage.toFixed(1)}%. Keep learning and try again!`);
    }
    setTimeout(() => setToastMessage(''), 6000);
  };

  // Find latest attempt for a given test
  const getLatestAttemptForTest = (testId) => {
    const testAttempts = attempts.filter((a) => a.skillTestId === testId);
    if (testAttempts.length === 0) return null;
    return testAttempts.sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt))[0];
  };

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
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(99, 102, 241, 0.25)',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={24} />
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Skill Verification & Certifications
              </h1>
            </div>
            <p style={{ color: '#c7d2fe', fontSize: '0.95rem', maxWidth: '680px', lineHeight: 1.6 }}>
              Validate your technical competencies through standardized MCQ evaluations. Score 70% or higher to earn
              verified skill badges on your profile and get prioritized in student mentorship recommendations.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399' }}>
                {attempts.filter((a) => a.passed).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Verified Badges</div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#818cf8' }}>
                {attempts.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Tests Attempted</div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="alert alert-success animate-fade-in">
          <CheckCircle size={18} />
          <div>{toastMessage}</div>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('available')}
          className="btn"
          style={{
            backgroundColor: activeTab === 'available' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'available' ? '#fff' : '#9ca3af',
            border: 'none',
            fontWeight: 700,
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <BookOpen size={16} /> Available Skill Tests ({tests.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className="btn"
          style={{
            backgroundColor: activeTab === 'history' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'history' ? '#fff' : '#9ca3af',
            border: 'none',
            fontWeight: 700,
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <RotateCcw size={16} /> My Assessment History ({attempts.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
          Loading skill assessments...
        </div>
      ) : activeTab === 'available' ? (
        /* Available Assessments Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {tests.map((test) => {
            const latestAttempt = getLatestAttemptForTest(test.id);
            const isVerified = test.isVerified || (latestAttempt && latestAttempt.passed);

            return (
              <div
                key={test.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderColor: isVerified ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)',
                  background: isVerified
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), var(--bg-card))'
                    : 'var(--bg-card)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {test.categoryName || 'Technical'}
                    </span>

                    {isVerified ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                        }}
                      >
                        <ShieldCheck size={14} /> VERIFIED {latestAttempt ? `${Math.round(latestAttempt.scorePercentage)}%` : ''}
                      </span>
                    ) : latestAttempt ? (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                        }}
                      >
                        Failed ({latestAttempt.scorePercentage.toFixed(0)}%)
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          backgroundColor: 'var(--bg-secondary)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                        }}
                      >
                        Not Attempted
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                    {test.title}
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {test.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-secondary)',
                      fontSize: '0.825rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <HelpCircle size={15} style={{ color: '#818cf8' }} />
                      <span>{test.totalQuestions} Questions</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={15} style={{ color: '#fbbf24' }} />
                      <span>{test.durationMinutes} Minutes</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ShieldCheck size={15} style={{ color: '#34d399' }} />
                      <span>Pass: {test.passingScore}%</span>
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setSelectedTest(test)}
                    className={isVerified ? 'btn btn-outline' : 'btn btn-primary'}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {isVerified ? (
                      <>
                        <RotateCcw size={15} /> Retake Assessment
                      </>
                    ) : latestAttempt ? (
                      <>
                        <RotateCcw size={15} /> Retake Test (Try Again)
                      </>
                    ) : (
                      <>
                        <Award size={15} /> Take Assessment <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Assessment History Tab */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {attempts.length === 0 ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#9ca3af' }}>
              <Award size={36} style={{ color: '#6366f1', margin: '0 auto 1rem', opacity: 0.6 }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0' }}>No Skill Assessments Taken Yet</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Take your first test from the Available Assessments tab to earn your verified badge.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: '#9ca3af' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Test Name</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Skill</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Attempt Date</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Score</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Verified Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((att) => (
                    <tr
                      key={att.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#fff' }}>
                        {att.testTitle}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#818cf8', fontWeight: 600 }}>
                        {att.skillName}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#9ca3af' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={14} />
                          {new Date(att.attemptedAt).toLocaleDateString()} at{' '}
                          {new Date(att.attemptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            color: att.passed ? '#34d399' : '#f87171',
                            fontSize: '0.95rem',
                          }}
                        >
                          {att.scorePercentage.toFixed(1)}%
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '4px' }}>
                          ({att.score}/{att.totalQuestions})
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {att.passed ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            <CheckCircle size={13} /> PASSED
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            <XCircle size={13} /> FAILED
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        {att.passed ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              backgroundColor: 'rgba(16, 185, 129, 0.25)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.5)',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                            }}
                          >
                            <ShieldCheck size={13} /> VERIFIED
                          </span>
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Not Granted</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Assessment Interactive Modal */}
      {selectedTest && (
        <SkillAssessmentModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onCompleted={handleAssessmentCompleted}
        />
      )}
    </div>
  );
};
