import React, { useState, useEffect } from 'react';
import { IconClose } from './Icons';

const DEFAULT_COURSES = [
  'Software Engineering',
  'AI and Data Science',
  'Computer Science',
  'Information Technology',
  'Cybersecurity',
  'Electronics and Telecommunication',
  'Cloud Computing and DevOps',
  'Electrical Engineering',
];

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  availableCourses = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    course: '',
  });

  const [errors, setErrors] = useState({});
  const [customCourseMode, setCustomCourseMode] = useState(false);

  const isEditing = Boolean(initialData && initialData.id);

  // Combine available courses from backend with default programs
  const programOptions = Array.from(
    new Set([...availableCourses, ...DEFAULT_COURSES])
  ).filter(Boolean);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        age: initialData.age != null ? String(initialData.age) : '',
        course: initialData.course || '',
      });
      if (initialData.course && !programOptions.includes(initialData.course)) {
        setCustomCourseMode(true);
      } else {
        setCustomCourseMode(false);
      }
    } else {
      setFormData({
        name: '',
        email: '',
        age: '',
        course: programOptions[0] || 'Software Engineering',
      });
      setCustomCourseMode(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Student full legal name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Full name must contain at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Institutional email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address format.';
    }

    if (!formData.age) {
      errs.age = 'Student age is required.';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
        errs.age = 'Age must be a valid number between 5 and 100.';
      }
    }

    if (!formData.course.trim()) {
      errs.course = 'Academic program/course selection is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: parseInt(formData.age, 10),
      course: formData.course.trim(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
      >
        {/* Modal Header */}
        <div className="modal-header-bar">
          <div>
            <h2 className="modal-heading" id="student-modal-title">
              {isEditing ? 'Modify Student Record' : 'Student Registration'}
            </h2>
            <div className="modal-subheading">
              {isEditing
                ? `Update academic records for Record ID #${initialData.id}`
                : 'Enter legal student information to register in PostgreSQL registry'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-action"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <IconClose size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form-content">
          {/* Full Legal Name */}
          <div className="form-row">
            <label htmlFor="student-name-input" className="form-field-label">
              Legal Full Name <span className="field-required">*</span>
            </label>
            <input
              id="student-name-input"
              type="text"
              className={`form-text-input ${errors.name ? 'form-input-error' : ''}`}
              placeholder="e.g. Eleanor Vance"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.name && <div className="form-error-msg">{errors.name}</div>}
          </div>

          {/* Email Address */}
          <div className="form-row">
            <label htmlFor="student-email-input" className="form-field-label">
              Email Address <span className="field-required">*</span>
            </label>
            <input
              id="student-email-input"
              type="email"
              className={`form-text-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="e.g. eleanor.vance@university.edu"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              disabled={isSubmitting}
            />
            {errors.email && <div className="form-error-msg">{errors.email}</div>}
          </div>

          {/* Age & Academic Program */}
          <div className="form-dual-row">
            {/* Age */}
            <div className="form-row">
              <label htmlFor="student-age-input" className="form-field-label">
                Age <span className="field-required">*</span>
              </label>
              <input
                id="student-age-input"
                type="number"
                min="5"
                max="100"
                className={`form-text-input ${errors.age ? 'form-input-error' : ''}`}
                placeholder="e.g. 21"
                value={formData.age}
                onChange={(e) => {
                  setFormData({ ...formData, age: e.target.value });
                  if (errors.age) setErrors({ ...errors, age: null });
                }}
                disabled={isSubmitting}
              />
              {errors.age && <div className="form-error-msg">{errors.age}</div>}
            </div>

            {/* Academic Program */}
            <div className="form-row">
              <div className="label-dual-wrap">
                <label htmlFor="student-program-input" className="form-field-label">
                  Academic Program <span className="field-required">*</span>
                </label>
                <button
                  type="button"
                  className="btn-mode-toggle"
                  onClick={() => setCustomCourseMode(!customCourseMode)}
                >
                  {customCourseMode ? 'Select from list' : '+ Custom program'}
                </button>
              </div>

              {customCourseMode ? (
                <input
                  id="student-program-input"
                  type="text"
                  className={`form-text-input ${errors.course ? 'form-input-error' : ''}`}
                  placeholder="Enter academic program / major..."
                  value={formData.course}
                  onChange={(e) => {
                    setFormData({ ...formData, course: e.target.value });
                    if (errors.course) setErrors({ ...errors, course: null });
                  }}
                  disabled={isSubmitting}
                />
              ) : (
                <select
                  id="student-program-input"
                  className={`form-select-input ${errors.course ? 'form-input-error' : ''}`}
                  value={formData.course}
                  onChange={(e) => {
                    setFormData({ ...formData, course: e.target.value });
                    if (errors.course) setErrors({ ...errors, course: null });
                  }}
                  disabled={isSubmitting}
                >
                  <option value="">Select Academic Program</option>
                  {programOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
              {errors.course && <div className="form-error-msg">{errors.course}</div>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions-bar">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              id="submit-student-btn"
            >
              {isSubmitting
                ? 'Processing...'
                : isEditing
                ? 'Save Record Changes'
                : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
