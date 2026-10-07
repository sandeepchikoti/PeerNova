import React from 'react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <p style={{ fontWeight: 600, color: '#f3f4f6' }}>
          PeerNova — Learn. Share. Connect. Grow.
        </p>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
          An Intelligent Student-to-Student Skill Sharing Ecosystem | B.Tech Major Project
        </p>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
          Spring Boot REST API • MySQL Database • React.js Single Page App • JWT Security
        </p>
      </div>
    </footer>
  );
};
