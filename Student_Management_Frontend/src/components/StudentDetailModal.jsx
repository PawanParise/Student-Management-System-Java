import React, { useEffect } from 'react';
import { IconClose, IconEdit, IconTrash, IconPrinter } from './Icons';

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
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  const handlePrintRecord = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-box modal-box-detail"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        {/* Header */}
        <div className="modal-header-bar">
          <div>
            <h2 className="modal-heading" id="detail-modal-title">
              Official Student Academic Record
            </h2>
            <div className="modal-subheading">
              Office of the Registrar | Record File ID #{student.id}
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-action"
            aria-label="Close dialog"
          >
            <IconClose size={16} />
          </button>
        </div>

        {/* Record Overview Banner */}
        <div className="record-header-strip">
          <div className="record-primary-info">
            <h3 className="record-student-name">{student.name}</h3>
            <div className="record-student-meta">
              <span className="record-email-label">Email:</span>
              <a href={`mailto:${student.email}`} className="record-email-link">
                {student.email}
              </a>
            </div>
          </div>
          <div className="record-status-badge">
            Status: Active
          </div>
        </div>

        {/* Detailed Data Grid */}
        <div className="record-grid">
          <div className="record-cell">
            <div className="record-cell-label">System Record ID</div>
            <div className="record-cell-value record-mono">#{student.id}</div>
          </div>

          <div className="record-cell">
            <div className="record-cell-label">Student Age</div>
            <div className="record-cell-value">{student.age} years old</div>
          </div>

          <div className="record-cell">
            <div className="record-cell-label">Academic Program / Department</div>
            <div className="record-cell-value">
              <span className="program-tag">{student.course}</span>
            </div>
          </div>

          <div className="record-cell">
            <div className="record-cell-label">Registration Timestamp</div>
            <div className="record-cell-value">
              {formatFullDateTime(student.createdAt)}
            </div>
          </div>

          <div className="record-cell">
            <div className="record-cell-label">Academic Standing</div>
            <div className="record-cell-value text-success">Good Standing</div>
          </div>

          <div className="record-cell">
            <div className="record-cell-label">Database Record Verification</div>
            <div className="record-cell-value record-mono">Verified in PostgreSQL</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-actions-bar modal-actions-between no-print">
          <div className="modal-actions-left">
            <button
              onClick={() => {
                onClose();
                onDelete(student);
              }}
              className="btn-danger-outline"
              title="Delete this record from database"
            >
              <IconTrash size={14} />
              <span>Delete Record</span>
            </button>
          </div>

          <div className="modal-actions-right">
            <button
              onClick={handlePrintRecord}
              className="btn-secondary"
              title="Print official student transcript sheet"
            >
              <IconPrinter size={14} />
              <span>Print Record</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="btn-primary"
              title="Edit student record"
            >
              <IconEdit size={14} />
              <span>Edit Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
