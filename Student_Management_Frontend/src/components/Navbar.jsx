import React from 'react';
import {
  GraduationCap,
  Plus,
  Moon,
  Sun,
  Server,
  FileCode,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  theme,
  toggleTheme,
  onOpenCreateModal,
  isBackendHealthy,
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-logo-glow">
            <GraduationCap className="brand-icon" size={26} />
          </div>
          <div>
            <div className="brand-title">
              EduPulse <span className="brand-badge">PRO</span>
            </div>
            <div className="brand-subtitle">Full Stack Student Management</div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="navbar-actions">
          {/* Backend Connection Indicator */}
          <div
            className={`status-pill ${
              isBackendHealthy ? 'status-online' : 'status-offline'
            }`}
            title={
              isBackendHealthy
                ? 'Backend connected: Spring Boot + PostgreSQL on port 8080'
                : 'Backend unreachable. Please verify Spring Boot server.'
            }
          >
            <span className="pulse-dot"></span>
            <Server size={13} style={{ marginRight: '5px' }} />
            <span>{isBackendHealthy ? 'Spring Boot Active' : 'Disconnected'}</span>
          </div>

          {/* Swagger API Docs link */}
          <a
            href="http://localhost:8080/swagger-ui/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            title="Open Swagger OpenAPI Documentation"
          >
            <FileCode size={16} />
            <span className="btn-text-desktop">Swagger UI</span>
          </a>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn-icon theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            id="theme-toggle-button"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Add Student Primary Action */}
          <button
            onClick={onOpenCreateModal}
            className="btn-primary"
            id="add-student-btn"
          >
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
