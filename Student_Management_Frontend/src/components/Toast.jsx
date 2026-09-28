import React from 'react';
import { IconClose, IconCheck, IconAlertTriangle } from './Icons';

export default function Toast({ toasts = [], removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-tray" aria-live="polite" role="region">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`toast-unit toast-${toast.type || 'info'}`}
            role="alert"
          >
            <div className="toast-status-icon">
              {isSuccess ? (
                <IconCheck size={14} />
              ) : isError ? (
                <IconAlertTriangle size={14} />
              ) : (
                <span className="toast-dot-bullet">•</span>
              )}
            </div>

            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-msg">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close-btn"
              aria-label="Dismiss notification"
            >
              <IconClose size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
