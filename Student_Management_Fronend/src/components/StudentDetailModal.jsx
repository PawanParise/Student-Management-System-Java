import React from 'react';
import {
  X,
  Mail,
  Calendar,
  GraduationCap,
  Hash,
  Clock,
  Edit2,
  Trash2,
} from 'lucide-react';

function getAvatarGradient(name = '') {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatFullDateTime(dateStr) {
  if (!dateStr) return 'Not recorded';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return dateStr;
  }
}

export default function StudentDetailModal({
  isOpen,
  student,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container detail-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          onClick={onClose}
          className="modal-close-btn float-close"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div className="profile-banner">
          <div
            className="profile-avatar-large"
            style={{ background: getAvatarGradient(student.name) }}
          >
            {getInitials(student.name)}
          </div>
          <h2 className="profile-name">{student.name}</h2>
          <div className="profile-email-chip">
            <Mail size={13} style={{ marginRight: '5px' }} />
            <a href={`mailto:${student.email}`} className="email-link">
              {student.email}
            </a>
          </div>
        </div>

        {/* Info Grid */}
        <div className="profile-info-grid">
          <div className="info-cell">
            <div className="info-cell-label">
              <Hash size={14} /> Student ID
            </div>
            <div className="info-cell-value">#{student.id}</div>
          </div>

          <div className="info-cell">
            <div className="info-cell-label">
              <Calendar size={14} /> Age
            </div>
            <div className="info-cell-value">{student.age} years old</div>
          </div>

          <div className="info-cell">
            <div className="info-cell-label">
              <GraduationCap size={14} /> Course / Stream
            </div>
            <div className="info-cell-value">
              <span className="course-pill">{student.course}</span>
            </div>
          </div>

          <div className="info-cell">
            <div className="info-cell-label">
              <Clock size={14} /> Enrollment Date
            </div>
            <div className="info-cell-value">
              {formatFullDateTime(student.createdAt)}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer profile-footer">
          <button
            onClick={() => {
              onClose();
              onDelete(student);
            }}
            className="btn-danger-ghost"
          >
            <Trash2 size={16} />
            <span>Delete Student</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onEdit(student);
            }}
            className="btn-primary"
          >
            <Edit2 size={16} />
            <span>Edit Information</span>
          </button>
        </div>
      </div>
    </div>
  );
}
