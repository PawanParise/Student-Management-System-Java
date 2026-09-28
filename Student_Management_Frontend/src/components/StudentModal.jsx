import React, { useState, useEffect } from 'react';
import { X, User, Mail, Calendar, GraduationCap, Loader2, Sparkles } from 'lucide-react';

const COMMON_COURSES = [
  'Software Engineering',
  'AI_DS',
  'Computer Science',
  'Data Science',
  'Cybersecurity',
  'ETC',
  'Information Technology',
  'Cloud Computing',
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

  // Merge available courses with predefined common ones
  const allCourseOptions = Array.from(
    new Set([...availableCourses, ...COMMON_COURSES])
  ).filter(Boolean);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        age: initialData.age != null ? String(initialData.age) : '',
        course: initialData.course || '',
      });
      // Check if course is in existing list
      if (initialData.course && !allCourseOptions.includes(initialData.course)) {
        setCustomCourseMode(true);
      } else {
        setCustomCourseMode(false);
      }
    } else {
      setFormData({
        name: '',
        email: '',
        age: '',
        course: allCourseOptions[0] || 'Software Engineering',
      });
      setCustomCourseMode(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.age) {
      errs.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
        errs.age = 'Age must be between 5 and 100';
      }
    }

    if (!formData.course.trim()) {
      errs.course = 'Please select or enter a course stream';
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Sparkles size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="modal-title" id="modal-title">
                {isEditing ? 'Edit Student Details' : 'Enroll New Student'}
              </h2>
              <p className="modal-subtitle">
                {isEditing
                  ? `Update information for #${initialData.id} (${initialData.name})`
                  : 'Enter student information to store in PostgreSQL'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required-star">*</span>
            </label>
            <div className="input-group">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="e.g. john@university.edu"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Age & Course Grid */}
          <div className="form-row-grid">
            {/* Age */}
            <div className="form-group">
              <label className="form-label">
                Age <span className="required-star">*</span>
              </label>
              <div className="input-group">
                <Calendar size={18} className="input-icon" />
                <input
                  type="number"
                  min="5"
                  max="100"
                  className={`form-input ${errors.age ? 'input-error' : ''}`}
                  placeholder="e.g. 21"
                  value={formData.age}
                  onChange={(e) => {
                    setFormData({ ...formData, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: null });
                  }}
                  disabled={isSubmitting}
                />
              </div>
              {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            {/* Course / Stream */}
            <div className="form-group">
              <div className="label-with-action">
                <label className="form-label">
                  Course / Stream <span className="required-star">*</span>
                </label>
                <button
                  type="button"
                  className="link-btn-toggle"
                  onClick={() => setCustomCourseMode(!customCourseMode)}
                >
                  {customCourseMode ? 'Choose from list' : '+ Custom Course'}
                </button>
              </div>

              <div className="input-group">
                <GraduationCap size={18} className="input-icon" />
                {customCourseMode ? (
                  <input
                    type="text"
                    className={`form-input ${errors.course ? 'input-error' : ''}`}
                    placeholder="Enter custom stream name..."
                    value={formData.course}
                    onChange={(e) => {
                      setFormData({ ...formData, course: e.target.value });
                      if (errors.course) setErrors({ ...errors, course: null });
                    }}
                    disabled={isSubmitting}
                  />
                ) : (
                  <select
                    className={`form-select ${errors.course ? 'input-error' : ''}`}
                    value={formData.course}
                    onChange={(e) => {
                      setFormData({ ...formData, course: e.target.value });
                      if (errors.course) setErrors({ ...errors, course: null });
                    }}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a Course</option>
                    {allCourseOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {errors.course && <span className="field-error">{errors.course}</span>}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
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
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="rotating" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Confirm Enrollment'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
