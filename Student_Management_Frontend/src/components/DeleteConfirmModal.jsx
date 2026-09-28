import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  student,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container delete-modal"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge danger-badge">
              <AlertTriangle size={20} className="text-danger" />
            </div>
            <div>
              <h2 className="modal-title text-danger">Delete Student Record</h2>
              <p className="modal-subtitle">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            disabled={isDeleting}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="delete-modal-body">
          <p>
            Are you sure you want to permanently delete student{' '}
            <strong className="delete-highlight">{student.name}</strong> (ID: #{student.id})?
          </p>
          <p className="delete-subtext">
            This will permanently remove the record from the PostgreSQL <code>students</code> database table.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(student.id)}
            className="btn-danger"
            disabled={isDeleting}
            id="confirm-delete-btn"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="rotating" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
