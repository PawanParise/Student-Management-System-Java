import React, { useEffect } from 'react';
import { IconClose, IconTrash, IconAlertTriangle } from './Icons';

export default function DeleteConfirmModal({
  isOpen,
  student = null,
  batchIds = null,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const isBatch = Boolean(batchIds && batchIds.length > 0);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-box modal-box-alert"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="modal-header-bar">
          <div className="alert-title-wrap">
            <div className="alert-icon-square">
              <IconAlertTriangle size={18} />
            </div>
            <div>
              <h2 className="modal-heading" id="delete-dialog-title">
                {isBatch ? 'Confirm Batch Deletion' : 'Confirm Record Deletion'}
              </h2>
              <div className="modal-subheading">
                Permanent database action
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-action"
            aria-label="Close dialog"
            disabled={isDeleting}
          >
            <IconClose size={16} />
          </button>
        </div>

        <div className="modal-alert-body">
          {isBatch ? (
            <p className="alert-text">
              You are about to permanently delete <strong>{batchIds.length}</strong> selected student record(s) from the PostgreSQL registry.
            </p>
          ) : (
            <p className="alert-text">
              Are you sure you want to permanently delete the academic record for{' '}
              <strong>{student?.name}</strong> (Record ID #{student?.id})?
            </p>
          )}
          <div className="alert-warning-box">
            This action cannot be undone. All associated enrollment records will be permanently removed.
          </div>
        </div>

        <div className="modal-actions-bar">
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
            onClick={() => onConfirm(isBatch ? batchIds : student?.id)}
            className="btn-danger"
            disabled={isDeleting}
            id="confirm-delete-button"
          >
            <IconTrash size={14} />
            <span>
              {isDeleting
                ? 'Deleting...'
                : isBatch
                ? `Delete ${batchIds.length} Records`
                : 'Confirm Deletion'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
