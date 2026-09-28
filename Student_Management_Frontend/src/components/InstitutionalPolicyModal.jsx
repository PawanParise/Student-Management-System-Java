import React, { useEffect } from 'react';
import { IconClose, IconShield, IconFileText } from './Icons';

export default function InstitutionalPolicyModal({ isOpen, type, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-box modal-box-large"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-dialog-title"
      >
        <div className="modal-header-bar">
          <div className="alert-title-wrap">
            <div className="policy-icon-square">
              {isPrivacy ? <IconShield size={18} /> : <IconFileText size={18} />}
            </div>
            <div>
              <h2 className="modal-heading" id="policy-dialog-title">
                {isPrivacy ? 'Institutional Privacy Policy & FERPA Compliance' : 'System Terms of Service & Acceptable Use'}
              </h2>
              <div className="modal-subheading">
                Office of the University Registrar | Official Academic Governance
              </div>
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

        <div className="policy-body-content">
          {isPrivacy ? (
            <div className="policy-text-section">
              <h4>1. Family Educational Rights and Privacy Act (FERPA)</h4>
              <p>
                The University Academic Information System strictly adheres to FERPA standards regarding the maintenance, confidentiality, and dissemination of student education records. Personally Identifiable Information (PII) including full names, institutional email addresses, student identification numbers, and enrollment timestamps are protected against unauthorized inspection.
              </p>

              <h4>2. Record Retention & Database Security</h4>
              <p>
                Student demographic and enrollment records are persisted within an ACID-compliant PostgreSQL database repository. Access to the administrative API is restricted to authorized academic personnel. Data transmission is encrypted and verified through backend validation constraints.
              </p>

              <h4>3. Student Inspection Rights</h4>
              <p>
                Enrolled students retain the legal right to inspect and review official academic records maintained by the Office of the Registrar. Requests for record amendment or discrepancy audits must be submitted directly through official registrar channels.
              </p>

              <h4>4. Data Sharing & Third-Party Disclosure</h4>
              <p>
                Academic records are never commercialized, distributed to third-party advertisers, or used outside of institutional accreditation, state academic auditing, and degree conferral requirements.
              </p>
            </div>
          ) : (
            <div className="policy-text-section">
              <h4>1. Authorized Administrative Access</h4>
              <p>
                This Student Management Registry is provided exclusively for university administrative personnel, department chairs, and designated registrar officers. Unauthorized access attempts, credential sharing, or extraction of student records are strictly prohibited under university bylaws.
              </p>

              <h4>2. Data Integrity & Validation</h4>
              <p>
                Users registering or modifying student records are required to provide verified legal names, official institutional email addresses, and accurate demographic data. All transactions are logged with timestamps in accordance with auditing requirements.
              </p>

              <h4>3. Record Deletion Protocol</h4>
              <p>
                Deletion of student records is permanent and propagates immediately to the persistent PostgreSQL data store. Administrative users must verify student identity and obtain appropriate academic committee authorization prior to executing deletion actions.
              </p>

              <h4>4. System Maintenance & Auditing</h4>
              <p>
                The registry undergoes continuous session auditing, automated integrity validation, and periodic database maintenance to ensure 99.9% uptime for academic enrollment cycles.
              </p>
            </div>
          )}
        </div>

        <div className="modal-actions-bar">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
