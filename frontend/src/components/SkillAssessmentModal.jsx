import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/apiClient';
import {
  X,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const SkillAssessmentModal = ({ test, onClose, onCompleted }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((test.durationMinutes || 10) * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);

  // Fetch questions on mount
  useEffect(() => {
    let isMounted = true;
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await api.getSkillTestQuestions(test.id);
        if (isMounted) {
          setQuestions(data);
          setTimeLeft((test.durationMinutes || 10) * 60);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load assessment questions.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchQuestions();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [test.id]);

  // Countdown timer
  useEffect(() => {
    if (loading || result || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, result]);

  const handleAutoSubmit = () => {
    if (!result && !submitting) {
      handleSubmit();
    }
  };

  const handleSelectOption = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmit = async () => {
    if (submitting || result) return;
    setSubmitting(true);
    setError('');

    try {
      if (timerRef.current) clearInterval(timerRef.current);
      const submissionPayload = {
        answers: answers,
      };
      const testResult = await api.submitSkillTest(test.id, submissionPayload);
      setResult(testResult);
      if (onCompleted) {
        onCompleted(testResult);
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.25rem',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6), rgba(15, 23, 42, 0.8))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Award size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {test.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{test.skillName}</span>
                <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>•</span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                  Passing Score: {test.passingScore}%
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!result && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  backgroundColor: timeLeft < 120 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                  border: `1px solid ${timeLeft < 120 ? '#ef4444' : 'rgba(245, 158, 11, 0.4)'}`,
                  color: timeLeft < 120 ? '#f87171' : '#fbbf24',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                <Clock size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#9ca3af' }}>
              <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: '#6366f1' }} />
              <p>Preparing verified skill assessment questions...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <AlertTriangle size={18} />
              <div>{error}</div>
            </div>
          ) : result ? (
            /* Results View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Result Summary Card */}
              <div
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  background: result.passed
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 95, 70, 0.25))'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(153, 27, 27, 0.25))',
                  border: `1px solid ${result.passed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: result.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: result.passed ? '#34d399' : '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}
                >
                  {result.passed ? <ShieldCheck size={36} /> : <AlertTriangle size={36} />}
                </div>

                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                  {result.passed ? 'Skill Verification Passed!' : 'Assessment Not Cleared'}
                </h3>

                <p style={{ color: '#d1d5db', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.25rem' }}>
                  {result.passed
                    ? `Congratulations! You scored ${result.scorePercentage.toFixed(1)}% and earned the verified skill badge for ${test.skillName}.`
                    : `You scored ${result.scorePercentage.toFixed(1)}%. Minimum passing threshold is ${test.passingScore}%. You can review the explanations below and re-attempt anytime.`}
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: result.passed ? '#34d399' : '#f87171' }}>
                      {result.scorePercentage.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Your Score</div>
                  </div>
                  <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-color)' }} />
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>
                      {result.totalMarksObtained} / {result.maxMarks}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Marks</div>
                  </div>
                  <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-color)' }} />
                  <div>
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: result.verifiedBadgeGranted ? '#34d399' : '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        justifyContent: 'center',
                        marginTop: '4px',
                      }}
                    >
                      <ShieldCheck size={16} />
                      {result.verifiedBadgeGranted ? 'VERIFIED' : 'PENDING'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Badge Status</div>
                  </div>
                </div>
              </div>

              {/* Question Feedback Breakdown */}
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                  Detailed Performance Review & Explanations ({result.feedbackList?.length || 0} Questions)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.feedbackList?.map((fb, idx) => (
                    <div
                      key={fb.questionId}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        border: `1px solid ${fb.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: fb.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                              color: fb.isCorrect ? '#34d399' : '#f87171',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                            {fb.questionText}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '999px',
                            backgroundColor: fb.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: fb.isCorrect ? '#34d399' : '#f87171',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {fb.marksAwarded} / {fb.maxMarks} Marks
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '0.75rem',
                          marginBottom: '0.75rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            color: fb.isCorrect ? '#34d399' : '#f87171',
                          }}
                        >
                          <span style={{ color: '#9ca3af' }}>Your Selection: </span>
                          <strong>Option {fb.selectedOption || 'None'}</strong>
                        </div>

                        <div
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            color: '#34d399',
                          }}
                        >
                          <span style={{ color: '#9ca3af' }}>Correct Answer: </span>
                          <strong>Option {fb.correctOption}</strong>
                        </div>
                      </div>

                      {fb.explanation && (
                        <div
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(99, 102, 241, 0.08)',
                            borderLeft: '3px solid #6366f1',
                            color: '#c7d2fe',
                            fontSize: '0.825rem',
                            lineHeight: 1.5,
                          }}
                        >
                          <strong>Explanation: </strong>
                          {fb.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Live Exam Flow */
            <div>
              {/* Question Navigator Pills */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {questions.map((q, idx) => {
                    const isAnswered = Boolean(answers[q.id]);
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: isCurrent
                            ? '2px solid #6366f1'
                            : isAnswered
                            ? '1px solid #10b981'
                            : '1px solid var(--border-color)',
                          backgroundColor: isCurrent
                            ? 'rgba(99, 102, 241, 0.3)'
                            : isAnswered
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'var(--bg-secondary)',
                          color: isCurrent ? '#fff' : isAnswered ? '#34d399' : '#9ca3af',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                  Answered: <strong style={{ color: '#fff' }}>{answeredCount}</strong> of{' '}
                  <strong style={{ color: '#fff' }}>{questions.length}</strong>
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: '4px',
                  backgroundColor: 'var(--border-color)',
                  borderRadius: '999px',
                  marginBottom: '1.75rem',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    backgroundColor: '#6366f1',
                    width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Current Question Block */}
              {currentQuestion && (
                <div
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: '#818cf8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Weight: {currentQuestion.marks} Mark{currentQuestion.marks > 1 ? 's' : ''}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    {currentQuestion.questionText}
                  </h3>

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { key: 'A', text: currentQuestion.optionA },
                      { key: 'B', text: currentQuestion.optionB },
                      { key: 'C', text: currentQuestion.optionC },
                      { key: 'D', text: currentQuestion.optionD },
                    ].map((opt) => {
                      const isSelected = answers[currentQuestion.id] === opt.key;
                      return (
                        <div
                          key={opt.key}
                          onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            padding: '0.9rem 1.15rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'var(--bg-surface)',
                            border: `1px solid ${isSelected ? '#6366f1' : 'var(--border-color)'}`,
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                            boxShadow: isSelected ? '0 0 12px rgba(99, 102, 241, 0.25)' : 'none',
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? '#6366f1' : '#6b7280'}`,
                              backgroundColor: isSelected ? '#6366f1' : 'transparent',
                              color: isSelected ? '#fff' : '#9ca3af',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {opt.key}
                          </div>
                          <span style={{ fontSize: '0.95rem', color: isSelected ? '#fff' : '#e2e8f0', fontWeight: isSelected ? 600 : 400 }}>
                            {opt.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          {result ? (
            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done & Return to Skill Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="btn btn-outline"
                style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="btn btn-secondary"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                ) : null}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || answeredCount === 0}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: answeredCount === questions.length ? '#10b981' : 'var(--accent-primary)',
                    borderColor: answeredCount === questions.length ? '#10b981' : 'var(--accent-primary)',
                  }}
                >
                  {submitting ? (
                    'Evaluating Test...'
                  ) : (
                    <>
                      <ShieldCheck size={16} /> Submit Assessment
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
