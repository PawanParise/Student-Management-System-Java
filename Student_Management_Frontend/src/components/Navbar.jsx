import React from 'react';
import {
  IconBuilding,
  IconPlus,
  IconMoon,
  IconSun,
  IconServer,
  IconPrinter
} from './Icons';

export default function Navbar({
  theme,
  toggleTheme,
  onOpenCreateModal,
  isBackendHealthy,
  onPrint,
}) {
  return (
    <header className="navbar-container no-print">
      <div className="navbar-inner">
        {/* Institutional Identity */}
        <div className="navbar-brand">
          <div className="brand-crest">
            <IconBuilding size={20} />
          </div>
          <div>
            <div className="brand-title">
              Academic Information System
            </div>
            <div className="brand-subtitle">
              Office of the University Registrar | Student Directory
            </div>
          </div>
        </div>

        {/* System & Operations Controls */}
        <div className="navbar-actions">
          {/* Term Status */}
          <div className="term-badge" title="Active Academic Session">
            Session: 2026-2027
          </div>

          {/* Database & API State */}
          <div
            className={`status-indicator ${
              isBackendHealthy ? 'status-connected' : 'status-disconnected'
            }`}
            title={
              isBackendHealthy
                ? 'Backend Operational: Spring Boot REST API & PostgreSQL connected'
                : 'Connection Unreachable: Spring Boot server offline'
            }
          >
            <span className="status-dot"></span>
            <IconServer size={13} className="status-icon" />
            <span>{isBackendHealthy ? 'Database Online' : 'Database Offline'}</span>
          </div>

          {/* Quick Print Button */}
          {onPrint && (
            <button
              onClick={onPrint}
              className="btn-toolbar"
              title="Print Current Student Roster"
              id="print-roster-btn"
            >
              <IconPrinter size={15} />
              <span className="btn-label-desktop">Print Roster</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn-toolbar"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            id="theme-toggle-button"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
          </button>

          {/* Primary Action: Register Student */}
          <button
            onClick={onOpenCreateModal}
            className="btn-primary"
            id="add-student-btn"
          >
            <IconPlus size={16} />
            <span>Register Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
