import React, { useState, useEffect } from 'react';
import {
  FileText, Sparkles, Compass, Printer, Save, RefreshCw, CheckCircle2,
  AlertCircle, Plus, Trash2, ShieldCheck, Award, Star, ExternalLink, HelpCircle
} from 'lucide-react';
import { api } from '../api/apiClient';
import ResumePreview from '../components/ResumePreview';
import LearningRoadmapModal from '../components/LearningRoadmapModal';

export const ResumeBuilder = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  // AI assistant state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    setLoading(true);
    try {
      const data = await api.getMyResume();
      setResume(data);
    } catch (err) {
      console.error('Failed to load resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resume) return;
    setSaving(true);
    setMessage('');
    try {
      const updated = await api.saveResume(resume);
      setResume(updated);
      setMessage('Resume saved and ATS analyzed successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Failed to save resume: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSyncCredentials = async () => {
    setSyncing(true);
    setMessage('');
    try {
      const updated = await api.syncResumeCredentials();
      setResume(updated);
      setMessage('Synced PeerNova verified skill badges, certificates, and tutoring rating!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Failed to sync credentials: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // -------------------------------------------------------------
  // AI Copilot Handlers
  // -------------------------------------------------------------
  const handleAiImprove = async (section, currentText) => {
    setAiLoading(true);
    setAiSuggestions(null);
    try {
      const res = await api.aiImproveResumeContent({
        section,
        currentText,
        targetRole: resume?.targetRole || 'Software Engineer',
      });
      setAiSuggestions({
        section,
        original: res.originalText,
        improved: res.improvedText,
        enhancements: res.enhancements,
        tip: res.recruiterTip,
      });
    } catch (err) {
      alert('AI Improvement failed: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = (improvedText) => {
    if (!aiSuggestions) return;
    if (aiSuggestions.section === 'SUMMARY') {
      setResume((prev) => ({ ...prev, summary: improvedText }));
    }
    setAiSuggestions(null);
  };

  // -------------------------------------------------------------
  // Form Field Updates
  // -------------------------------------------------------------
  const updateField = (field, val) => {
    setResume((prev) => ({ ...prev, [field]: val }));
  };

  // Experience handlers
  const addExperience = () => {
    const newItem = {
      role: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [''],
    };
    setResume((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), newItem],
    }));
  };

  const updateExperience = (index, field, val) => {
    const list = [...(resume.experience || [])];
    list[index] = { ...list[index], [field]: val };
    setResume((prev) => ({ ...prev, experience: list }));
  };

  const removeExperience = (index) => {
    const list = [...(resume.experience || [])];
    list.splice(index, 1);
    setResume((prev) => ({ ...prev, experience: list }));
  };

  // Projects handlers
  const addProject = () => {
    const newItem = {
      title: '',
      techStack: '',
      githubUrl: '',
      liveUrl: '',
      description: '',
      highlights: [''],
    };
    setResume((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newItem],
    }));
  };

  const updateProject = (index, field, val) => {
    const list = [...(resume.projects || [])];
    list[index] = { ...list[index], [field]: val };
    setResume((prev) => ({ ...prev, projects: list }));
  };

  const removeProject = (index) => {
    const list = [...(resume.projects || [])];
    list.splice(index, 1);
    setResume((prev) => ({ ...prev, projects: list }));
  };

  // Education handlers
  const updateEducation = (index, field, val) => {
    const list = [...(resume.education || [])];
    list[index] = { ...list[index], [field]: val };
    setResume((prev) => ({ ...prev, education: list }));
  };

  // Skill category handlers
  const addSkillCategory = () => {
    const newCat = { category: 'New Category', skills: [] };
    setResume((prev) => ({
      ...prev,
      skillCategories: [...(prev.skillCategories || []), newCat],
    }));
  };

  const updateSkillCategory = (index, field, val) => {
    const list = [...(resume.skillCategories || [])];
    list[index] = { ...list[index], [field]: val };
    setResume((prev) => ({ ...prev, skillCategories: list }));
  };

  const removeSkillCategory = (index) => {
    const list = [...(resume.skillCategories || [])];
    list.splice(index, 1);
    setResume((prev) => ({ ...prev, skillCategories: list }));
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#6366f1' }} />
        <p>Loading AI Resume & Academic Portfolio...</p>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Resume not found</h3>
        <button onClick={loadResume} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  const allSkillsList = (resume.skillCategories || []).flatMap((c) => c.skills || []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Action Header Bar */}
      <div
        className="card no-print"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          borderColor: '#3730a3',
          padding: '1.25rem 1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}>
                <FileText size={18} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                AI Resume Builder & Career Copilot
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: (resume.atsScore || 80) >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: (resume.atsScore || 80) >= 80 ? '#34d399' : '#fbbf24',
                  border: `1px solid ${(resume.atsScore || 80) >= 80 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                }}
              >
                🎯 {resume.atsScore || 80}/100 ATS Score
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#c7d2fe' }}>
              Autofills verified peer learning badges, tutor ratings, and certifications with Gemini AI text optimization.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowRoadmapModal(true)}
              className="btn btn-outline btn-sm"
              style={{ color: '#c084fc', borderColor: 'rgba(192, 132, 252, 0.4)' }}
            >
              <Compass size={15} />
              AI Career Roadmap
            </button>

            <button
              onClick={handleSyncCredentials}
              disabled={syncing}
              className="btn btn-outline btn-sm"
              style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
              title="Pull verified test badges, certificate numbers, and mentor ratings"
            >
              <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Sync PeerNova Credentials'}
            </button>

            <button
              onClick={handlePrint}
              className="btn btn-outline btn-sm"
              style={{ color: '#fff' }}
            >
              <Printer size={15} />
              Export PDF / Print
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save & Evaluate'}
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-success no-print" style={{ padding: '0.75rem 1rem' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Main 2-Column Workspace: Left Editor / Right Live ATS Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(420px, 1fr) minmax(460px, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left Column: Interactive Editor Tabs & AI Assistant */}
        <div className="card no-print" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Template & Options Selector Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid #1e293b',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Design Template:</span>
              <button
                onClick={() => updateField('selectedTemplate', 'MODERN')}
                className={`btn btn-sm ${resume.selectedTemplate === 'MODERN' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                Modern Clean
              </button>
              <button
                onClick={() => updateField('selectedTemplate', 'CLASSIC')}
                className={`btn btn-sm ${resume.selectedTemplate === 'CLASSIC' ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                Classic Academic
              </button>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#34d399', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={resume.includePeerNovaMetrics}
                onChange={(e) => updateField('includePeerNovaMetrics', e.target.checked)}
              />
              Include PeerNova Ratings & Badges
            </label>
          </div>

          {/* Navigation Pill Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'summary', label: 'Summary & Profile' },
              { id: 'experience', label: `Experience (${(resume.experience || []).length})` },
              { id: 'projects', label: `Projects (${(resume.projects || []).length})` },
              { id: 'skills', label: 'Skills & Badges' },
              { id: 'education', label: 'Education' },
              { id: 'certifications', label: `Certificates (${(resume.certifications || []).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn btn-sm"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  background: activeTab === tab.id ? '#6366f1' : 'rgba(30, 41, 59, 0.6)',
                  color: activeTab === tab.id ? '#fff' : '#94a3b8',
                  border: `1px solid ${activeTab === tab.id ? '#6366f1' : '#334155'}`,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* AI Suggestions Floating Drawer / Card */}
          {aiSuggestions && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95), rgba(15, 23, 42, 0.98))',
              border: '1px solid #8b5cf6',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.25)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} /> Gemini AI Suggested Rewrite
                </span>
                <button
                  onClick={() => setAiSuggestions(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#f1f5f9', background: 'rgba(15, 23, 42, 0.8)', padding: '0.85rem', borderRadius: '8px', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {aiSuggestions.improved}
              </div>

              {aiSuggestions.enhancements && (
                <ul style={{ margin: '0 0 0.85rem', paddingLeft: '1.25rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {aiSuggestions.enhancements.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAiSuggestions(null)}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => applyAiSuggestion(aiSuggestions.improved)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.75rem', background: '#8b5cf6', borderColor: '#8b5cf6' }}
                >
                  Apply to Resume
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: SUMMARY & PROFILE */}
          {activeTab === 'summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Professional Headline</label>
                <input
                  type="text"
                  className="form-input"
                  value={resume.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  placeholder="e.g. Computer Science Student | Aspiring Full Stack Engineer & Peer Mentor"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Target Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value={resume.targetRole || ''}
                    onChange={(e) => updateField('targetRole', e.target.value)}
                    placeholder="Full Stack Software Engineer"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={resume.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>GitHub URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={resume.githubUrl || ''}
                    onChange={(e) => updateField('githubUrl', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>LinkedIn URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={resume.linkedinUrl || ''}
                    onChange={(e) => updateField('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem', margin: 0 }}>
                    Professional Summary (ATS Optimized)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiImprove('SUMMARY', resume.summary || '')}
                    disabled={aiLoading}
                    className="btn btn-sm"
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: '#c084fc',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                    }}
                  >
                    <Sparkles size={12} />
                    {aiLoading ? 'Improving...' : 'AI Rewrite Summary'}
                  </button>
                </div>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={resume.summary || ''}
                  onChange={(e) => updateField('summary', e.target.value)}
                  placeholder="3-4 sentences highlighting technical focus, agile collaboration, and software accomplishments..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                  Work & Peer Tutoring Experience
                </span>
                <button
                  type="button"
                  onClick={addExperience}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>

              {(resume.experience || []).map((exp, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Role #{idx + 1}</strong>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Role (e.g. Peer Technical Mentor)"
                      value={exp.role || ''}
                      onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Organization (e.g. PeerNova Ecosystem)"
                      value={exp.organization || ''}
                      onChange={(e) => updateExperience(idx, 'organization', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Start Date (e.g. Aug 2025)"
                      value={exp.startDate || ''}
                      onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="End Date (or Present)"
                      value={exp.endDate || ''}
                      onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    />
                  </div>

                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Short description or impact metrics..."
                    value={exp.description || ''}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                  />

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                      Key Bullet Points (one per line)
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={(exp.highlights || []).join('\n')}
                      onChange={(e) => updateExperience(idx, 'highlights', e.target.value.split('\n'))}
                      placeholder="• Mentored 15+ engineering peers in DSA..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                  Technical Projects
                </span>
                <button
                  type="button"
                  onClick={addProject}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              {(resume.projects || []).map((proj, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Project #{idx + 1}</strong>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Project Title"
                    value={proj.title || ''}
                    onChange={(e) => updateProject(idx, 'title', e.target.value)}
                  />

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Tech Stack (e.g. React.js, Spring Boot, MySQL, WebSockets)"
                    value={proj.techStack || ''}
                    onChange={(e) => updateProject(idx, 'techStack', e.target.value)}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="GitHub Link"
                      value={proj.githubUrl || ''}
                      onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Live Demo URL"
                      value={proj.liveUrl || ''}
                      onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)}
                    />
                  </div>

                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Brief description..."
                    value={proj.description || ''}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                  />

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>
                      Key Accomplishment Bullet Points (one per line)
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={(proj.highlights || []).join('\n')}
                      onChange={(e) => updateProject(idx, 'highlights', e.target.value.split('\n'))}
                      placeholder="• Architected microservices with 99.9% uptime..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SKILLS & VERIFIED BADGES */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                  Technical Skills & Verified Badges
                </span>
                <button
                  type="button"
                  onClick={addSkillCategory}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              {(resume.skillCategories || []).map((cat, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ maxWidth: '280px', fontSize: '0.85rem', fontWeight: 700 }}
                      value={cat.category || ''}
                      onChange={(e) => updateSkillCategory(idx, 'category', e.target.value)}
                      placeholder="Category Name"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkillCategory(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Comma-separated skills (e.g. Java, Python, React.js, Docker)"
                    value={(cat.skills || []).join(', ')}
                    onChange={(e) => updateSkillCategory(idx, 'skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: EDUCATION */}
          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(resume.education || []).map((edu, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '1rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Institution (e.g. Malla Reddy University)"
                    value={edu.institution || ''}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Degree (e.g. B.Tech)"
                      value={edu.degree || ''}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Field (e.g. CSE)"
                      value={edu.fieldOfStudy || ''}
                      onChange={(e) => updateEducation(idx, 'fieldOfStudy', e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Start Year"
                      value={edu.startYear || ''}
                      onChange={(e) => updateEducation(idx, 'startYear', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="End Year"
                      value={edu.endYear || ''}
                      onChange={(e) => updateEducation(idx, 'endYear', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="GPA / CGPA"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                  PeerNova Certificates & External Credentials
                </span>
                <button
                  type="button"
                  onClick={handleSyncCredentials}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <RefreshCw size={14} /> Auto-Sync Phase 8 Certificates
                </button>
              </div>

              {(resume.certifications || []).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                  No certificates synced yet. Click "Auto-Sync Phase 8 Certificates" to pull your verified PeerNova certificates!
                </div>
              ) : (
                (resume.certifications || []).map((cert, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      background: 'rgba(15, 23, 42, 0.6)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.875rem' }}>{cert.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {cert.issuer} • Issued {cert.issueDate}
                      </div>
                      {cert.verificationId && (
                        <span style={{
                          fontSize: '0.7rem',
                          background: '#1e293b',
                          color: '#38bdf8',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                        }}>
                          ID: {cert.verificationId}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Printable ATS Resume Preview */}
        <div style={{ position: 'sticky', top: '1rem' }}>
          <div className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
            padding: '0 0.5rem',
          }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
              Live ATS Document Preview ({resume.selectedTemplate} Template)
            </span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={14} /> Verified Recruiter Ready
            </span>
          </div>

          <ResumePreview resume={resume} template={resume.selectedTemplate} />
        </div>
      </div>

      {/* Learning Roadmap Modal */}
      <LearningRoadmapModal
        isOpen={showRoadmapModal}
        onClose={() => setShowRoadmapModal(false)}
        currentSkills={allSkillsList}
        initialTargetRole={resume.targetRole || 'Full Stack Software Engineer'}
      />
    </div>
  );
};

export default ResumeBuilder;
