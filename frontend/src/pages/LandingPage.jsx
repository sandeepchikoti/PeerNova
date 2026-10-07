import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '4rem 0 3rem', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem', color: '#fff' }}>
          An Intelligent Student-to-Student Skill Sharing Ecosystem
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#9ca3af', maxWidth: '800px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          PeerNova connects students based on what they can teach, what they want to learn, proficiency levels, and academic goals using real AI-based peer recommendation.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Sign In to Account
          </Link>
        </div>
      </section>

      {/* Core Concept Pillar Cards */}
      <section style={{ margin: '3rem 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#fff' }}>
          Built for Collaborative Academic Growth
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <BookOpen size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Skill Sharing</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
              Add teaching and learning skills with specific proficiency levels. Match with peers who complement your academic interests.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>AI Peer Recommendation</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
              Powered by Python ML (Cosine Similarity, KNN, Clustering) to generate personalized compatibility match scores.
            </p>
          </div>

          <div className="card">
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>Admin Verification</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
              Strict separation between Student Profile Verification (Admin account approval) and Skill Test Verification.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Architecture Banner */}
      <section className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.95))', borderColor: '#374151', margin: '3rem 0 2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
              Spring Boot + React + MySQL Architecture
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '0.925rem' }}>
              Full RESTful API backend with Spring Security JWT, JPA Hibernate persistence, and scalable frontend state management.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-verified" style={{ padding: '0.4rem 0.85rem' }}>Spring Boot REST</span>
            <span className="badge badge-verified" style={{ padding: '0.4rem 0.85rem' }}>MySQL DB</span>
            <span className="badge badge-verified" style={{ padding: '0.4rem 0.85rem' }}>React 18 SPA</span>
            <span className="badge badge-verified" style={{ padding: '0.4rem 0.85rem' }}>JWT Auth</span>
          </div>
        </div>
      </section>
    </div>
  );
};
